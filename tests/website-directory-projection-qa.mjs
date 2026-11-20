import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
const db=new PGlite();
const store='00000000-0000-4000-8000-000000000001';
try{
 await db.exec(`create schema private;create schema auth;create role anon;create role authenticated;
 create function auth.uid() returns uuid language sql as $$select nullif(current_setting('test.actor',true),'')::uuid$$;
 create function private.totus_api_admin() returns void language plpgsql as $$begin if auth.uid() is null then raise exception 'Forbidden';end if;end$$;
 create function private.totus_can(text,text) returns boolean language sql as $$select auth.uid() is not null$$;
 create function private.totus_local_store_access(uuid) returns boolean language sql as $$select $1='${store}'::uuid$$;
 create table private.totus_websites(key text primary key,business_id uuid);
 create table private.totus_web_import_jobs(website_key text,state text,resources text[]);
 create table private.totus_web_source_records(website_key text,resource text,source_id bigint,data jsonb,primary key(website_key,resource,source_id));
 create table brands(id uuid primary key,store_id uuid,source_website text,source_id bigint,name text not null,email text,phone text,notes text,created_at timestamptz default now());
 create table ops_customers(id uuid primary key,store_id uuid,source_website text,source_id bigint,name text not null,email text,phone text,notes text,details jsonb,tax_id text,address text,city text,postal_code text,province text,country text,active boolean,created_at timestamptz default now(),updated_at timestamptz default now());
 create table ops_suppliers(like ops_customers including all);
 insert into private.totus_websites values('web-a','${store}'),('web-b','00000000-0000-4000-8000-000000000002');
 insert into private.totus_web_import_jobs values('web-a','completed',array['manufacturers','suppliers','customers']);
 insert into private.totus_web_source_records values
 ('web-a','customers',1,'{"firstname":"Ana","lastname":"Uno","email":"ana@example.invalid","active":"1"}'),
 ('web-a','suppliers',1,'{"name":"Proveedor Uno","active":"1"}'),
 ('web-a','manufacturers',1,'{"name":"Marca Uno"}'),
 ('web-a','addresses',1,'{"id_customer":"1","address1":"Calle A","city":"Ciudad","id_country":"1","dni":"ABC"}'),
 ('web-a','addresses',2,'{"id_customer":"1","address1":"Calle B"}'),
 ('web-a','countries',1,'{"name":"España"}');`);
 await db.exec(await readFile(new URL('../supabase/totus_web_directory_projection.sql',import.meta.url),'utf8'));
 const call=(resource=null,cursor=0,apply=false,web='web-a')=>db.query('select public.totus_web_directory_projection($1,$2,$3,$4) result',[web,resource,cursor,apply]).then(r=>r.rows[0].result);
 await assert.rejects(()=>call('customers',0,true),/sesión/);
 await db.exec(`set test.actor='00000000-0000-4000-8000-000000000003';`);
 await assert.rejects(()=>call('customers',0,true,'web-b'),/establecimiento/);
 assert.equal((await call()).resources.customers.available,1);
 for(const resource of ['manufacturers','suppliers','customers'])assert.equal((await call(resource,0,true)).processed,1);
 const customer=(await db.query('select * from ops_customers')).rows[0];
 assert.equal(customer.name,'Ana Uno');assert.equal(customer.tax_id,'ABC');assert.equal(customer.details.addresses.length,2);assert.equal(customer.country,'España');
 await call('customers',0,true);assert.equal((await db.query('select count(*)::int n from ops_customers')).rows[0].n,1);
 await db.exec(`update ops_customers set name='Cambio local';`);
 await call('customers',0,true);assert.equal((await db.query('select name from ops_customers')).rows[0].name,'Cambio local');
 await db.exec(`update private.totus_web_source_records set data=data||'{"firstname":"Cambio web"}' where resource='customers';`);
 assert.equal((await call('customers',0,true)).conflicts,1);assert.equal((await db.query('select name from ops_customers')).rows[0].name,'Cambio local');
 await db.exec(`insert into private.totus_web_import_jobs values('web-a','running',array['customers']);`);
 await assert.rejects(()=>call('customers',0,true),/Termina/);
 console.log('Isolated directory adoption: authenticated ownership, addresses, fiscal fields, replay, local preservation, conflict detection and active-import guard passed. No live data created.');
}finally{await db.close();}
