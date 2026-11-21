import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';import {PGlite} from '@electric-sql/pglite';
const db=new PGlite(),id='00000000-0000-4000-8000-000000000001';
try{
 await db.exec(`create schema private;create schema auth;create role anon;create role authenticated;
 create function auth.uid() returns uuid language sql as $$select nullif(current_setting('test.actor',true),'')::uuid$$;
 create function private.totus_api_admin() returns void language plpgsql as $$begin if auth.uid() is null then raise exception 'Forbidden';end if;end$$;
 create function private.totus_can(text,text) returns boolean language sql as $$select true$$;create function private.totus_local_store_access(uuid) returns boolean language sql as $$select true$$;
 create table public.ops_stores(id uuid primary key);insert into ops_stores values('${id}');
 create table private.totus_websites(key text primary key,business_id uuid);insert into private.totus_websites values('web-a','${id}');
 create table private.totus_web_source_records(website_key text,resource text,source_id bigint,data jsonb);
 create table private.totus_web_import_jobs(website_key text,state text);
 create table private.totus_web_native_catalogue_jobs(id uuid primary key,website_key text,state text,shop_id bigint,profile jsonb,created_at timestamptz default now());
 insert into private.totus_web_native_catalogue_jobs values('${id}','web-a','completed',1,'{"currency":"EUR","pricing_context":{"countryId":6}}');
 create table private.totus_web_native_catalogue_items(website_key text,shop_id bigint,product_id bigint,attribute_id bigint,job_id uuid,data jsonb);
 create table public.products(id uuid primary key,store_id uuid,source_website text,source_id bigint,sku text,name text,product_type text,status text,current_pvp numeric,brand_id uuid,supplier_id uuid,details jsonb,created_by uuid,created_at timestamptz default now(),updated_at timestamptz default now());
 create unique index on products(source_website,source_id);
 create table public.brands(id uuid,store_id uuid,source_website text,source_id bigint);create table public.ops_suppliers(like brands);
 create table public.product_variants(id uuid primary key,product_id uuid references products(id),source_website text,source_id bigint,sku text,name text,attributes jsonb,pvp numeric,cost_net numeric,active boolean,created_at timestamptz default now());
 create table private.totus_tpv_local_catalogue(store_id uuid,id uuid,product_id uuid,variant_id uuid,name text,reference text,ean text,price_cents bigint,tax_basis_points integer,stock numeric constraint totus_tpv_local_catalogue_stock_check check(stock>=0),metadata jsonb,active boolean,quantity_unit text,revision bigint default 1,primary key(store_id,id));
 insert into private.totus_web_source_records values
 ('web-a','products',1,'{"id":"1","name":"Uno","reference":"REPEAT","meta_title":"SEO Uno","associations":{"images":[{"id":"1"},{"id":"2"}]}}'),
 ('web-a','products',2,'{"id":"2","name":"Dos","reference":"REPEAT"}'),
 ('web-a','combinations',11,'{"id":"11","id_product":"2","reference":"","associations":{"product_option_values":[{"id":"1"},{"id":"2"}]}}'),
 ('web-a','combinations',12,'{"id":"12","id_product":"0"}'),
 ('web-a','product_options',1,'{"name":"Color"}'),('web-a','product_options',2,'{"name":"Talla"}'),
 ('web-a','product_option_values',1,'{"name":"Azul","id_attribute_group":"1"}'),('web-a','product_option_values',2,'{"name":"M","id_attribute_group":"2"}');
 insert into private.totus_web_native_catalogue_items values
 ('web-a',1,1,0,'${id}','{"preview_cents":1210,"unit_tax_incl":"12.100000","unit_tax_excl":"10.000000","stock":-2,"reference":"REPEAT"}'),
 ('web-a',1,2,11,'${id}','{"preview_cents":2420,"unit_tax_incl":"24.200000","unit_tax_excl":"20.000000","stock":3,"reference":"","enabled_for_sale":true}');`);
 await db.exec(await readFile(new URL('../supabase/totus_web_source_counters.sql',import.meta.url),'utf8'));
 await db.exec(await readFile(new URL('../supabase/totus_web_native_source_snapshot.sql',import.meta.url),'utf8'));
 await db.exec(await readFile(new URL('../supabase/totus_web_product_projection.sql',import.meta.url),'utf8'));
 const repriceFixture=async()=>{const next=(await db.query("insert into private.totus_web_native_catalogue_jobs(id,website_key,state,shop_id,profile,created_at) values(gen_random_uuid(),'web-a','completed',1,'{\"currency\":\"EUR\",\"pricing_context\":{\"countryId\":6}}',clock_timestamp()) returning id")).rows[0].id;await db.query("update private.totus_web_native_catalogue_items set job_id=$1 where website_key='web-a'",[next]);};
 const call=apply=>db.query('select public.totus_web_product_projection($1,0,$2) result',['web-a',apply]).then(r=>r.rows[0].result);
 await assert.rejects(()=>call(true),/sesión/);await db.exec(`set test.actor='${id}'`);
 assert.equal((await call(false)).pricesReady,false); // no retroactive certification of old jobs
 await db.exec(`update private.totus_web_source_records set data=data||'{"id_supplier":"777","id_manufacturer":"888"}' where resource='products' and source_id=1;`);
 await repriceFixture();
 assert.equal((await call(false)).orphanDirectoryProducts,1);
 assert.equal((await call(false)).orphanCombinations,1);assert.equal((await call(true)).processed,2);
 const orphan=(await db.query('select details,supplier_id,brand_id from products where source_id=1')).rows[0];
 assert.equal(orphan.details.sourceData.id_supplier,'777');assert.equal(orphan.supplier_id,null);assert.equal(orphan.brand_id,null);
 await db.exec(`insert into private.totus_web_source_records values('web-a','suppliers',777,'{"id":"777"}');`);
 assert.equal((await call(false)).pricesReady,false);
 await assert.rejects(()=>call(true),/importación ha cambiado/);
 await repriceFixture();
 await assert.rejects(()=>call(true),/Incorpora las marcas y proveedores/);
 await db.exec(`delete from private.totus_web_source_records where resource='suppliers' and source_id=777;`);
 await repriceFixture();
 let rows=(await db.query('select * from products order by source_id')).rows;assert.equal(rows.length,2);assert.equal(rows[0].details.metaTitle,'SEO Uno');assert.equal(rows[0].details.images.length,2);assert.equal(rows[0].sku,rows[1].sku);
 const variants=(await db.query('select * from product_variants')).rows;assert.deepEqual(variants[0].attributes,{Color:'Azul',Talla:'M'});assert.equal(variants[0].sku,'');
 assert.equal((await db.query('select stock from private.totus_tpv_local_catalogue order by stock')).rows[0].stock,'-2');
 const ids=rows.map(r=>r.id);await call(true);assert.deepEqual((await db.query('select id from products order by source_id')).rows.map(r=>r.id),ids);
 await db.exec(`update private.totus_tpv_local_catalogue set stock=stock-1 where product_id='${ids[0]}';update private.totus_web_source_records set data=data||'{"meta_title":"Remote SEO"}' where resource='products' and source_id=1;`);
 assert.equal((await call(false)).pricesReady,false);
 await assert.rejects(()=>call(true),/importación ha cambiado/);
 await repriceFixture();
 assert.equal((await call(true)).conflicts,1);assert.equal((await db.query('select stock from private.totus_tpv_local_catalogue where product_id=$1',[ids[0]])).rows[0].stock,'-3');
 assert.equal((await db.query("select has_function_privilege('anon','public.totus_web_product_projection(text,bigint,boolean)','execute') allowed")).rows[0].allowed,false);
 await db.exec(`alter table ops_stores add column active boolean default true;create table profiles(id uuid,active boolean);insert into profiles values('${id}',true);
 create table private.totus_local_workspace_requests(id uuid primary key,actor_id uuid,store_id uuid,intent jsonb,result jsonb,created_at timestamptz default now());
 create table private.totus_tpv_local_catalogue_requests(id uuid primary key,actor_id uuid,store_id uuid,item_id uuid,intent jsonb,result jsonb,created_at timestamptz);
 create table private.totus_tpv_local_audit(actor_id uuid,action text,record_id uuid,previous jsonb,current jsonb);`);
 await db.exec(await readFile(new URL('../supabase/totus_web_owned_catalogue_edits.sql',import.meta.url),'utf8'));
 const existing=(await db.query('select * from products where id=$1',[ids[0]])).rows[0];
 await db.query('select public.totus_local_store_workspace($1,$2,$3,$4,gen_random_uuid(),$5)',[id,'products','save',ids[0],{name:'Uno editado',reference:'REPEAT',unit:'unit',priceCents:1210,taxBasisPoints:2100,stock:-3,active:true,expectedRevision:existing.updated_at.toISOString(),variants:[],metaTitle:'SEO local'}]);
 const edited=(await db.query('select * from products where id=$1',[ids[0]])).rows[0];assert.equal(edited.details.images.length,2);assert.equal(edited.details.metaTitle,'SEO local');assert.equal(edited.source_website,'web-a');assert.equal((await db.query('select metadata from private.totus_tpv_local_catalogue where product_id=$1',[ids[0]])).rows[0].metadata.nativePrice.unit_tax_incl,'12.100000');
 const variable=(await db.query('select * from products where id=$1',[ids[1]])).rows[0];const variation=(await db.query('select * from product_variants where product_id=$1',[ids[1]])).rows[0];
 await db.query('select public.totus_local_store_workspace($1,$2,$3,$4,gen_random_uuid(),$5)',[id,'products','save',ids[1],{name:'Dos editado',reference:'REPEAT',unit:'unit',priceCents:2420,taxBasisPoints:2100,stock:3,active:false,expectedRevision:variable.updated_at.toISOString(),variants:[{id:variation.id,reference:'',attributes:{Color:'Azul',Talla:'M'},priceCents:2420,stock:-1,ean:'',active:false}]}]);
 const afterVariation=(await db.query('select * from product_variants where id=$1',[variation.id])).rows[0];assert.equal(afterVariation.source_id,11);assert.deepEqual(afterVariation.attributes,{Color:'Azul',Talla:'M'});assert.equal(afterVariation.active,false);assert.equal((await db.query('select stock,active from private.totus_tpv_local_catalogue where id=$1',[variation.id])).rows[0].stock,'-1');
 await db.exec(await readFile(new URL('../supabase/totus_local_store_read_page.sql',import.meta.url),'utf8'));
 await db.exec(`insert into products(id,store_id,sku,name,details) select gen_random_uuid(),'${id}','PAGE-'||n,'Paged '||lpad(n::text,2,'0'),'{}' from generate_series(1,51) n;`);
 const page=after=>db.query('select public.totus_local_store_read_page($1,$2,$3,$4) result',[id,'products','',after]).then(r=>r.rows[0].result);
 const first=await page(null),second=await page(first.nextCursor);assert.equal(first.total,53);assert.equal(first.items.length,50);assert.equal(second.items.length,3);assert.equal(second.nextCursor,null);assert.equal(new Set([...first.items,...second.items].map(r=>r.id)).size,53);assert.equal(first.items[0].details,undefined);
 const detail=(await db.query('select public.totus_local_store_read_page($1,$2,$3,null,1,$4) result',[id,'products','',ids[0]])).rows[0].result.items[0];assert.equal(detail.details.images.length,2);
 assert.equal((await db.query('select public.totus_local_store_read_page($1,$2,$3) result',[id,'products','SEO local'])).rows[0].result.total,1);
 console.log('Isolated product adoption: source identity, duplicate references, blank variant reference, all attributes/SEO/image associations, negative stock, replay/conflicts and complete keyset search/paging passed. No live records created.');
}finally{await db.close();}
