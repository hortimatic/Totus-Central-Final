import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';import {PGlite} from '@electric-sql/pglite';
const db=new PGlite();
try{
 await db.exec(`create schema private;create role anon;create role authenticated;create table private.totus_websites(key text primary key);insert into private.totus_websites values('web-a'),('web-b');create table public.products(id uuid primary key,store_id uuid,sku text unique);create unique index products_normalized_sku on public.products(lower(btrim(sku)));create table public.product_variants(id uuid primary key,product_id uuid,sku text unique);create unique index variants_normalized_sku on public.product_variants(lower(btrim(sku)));create table public.brands(id uuid primary key,store_id uuid,name text unique);create table public.ops_customers(id uuid primary key,store_id uuid,tax_id text);create table public.ops_suppliers(id uuid primary key,store_id uuid,name text,tax_id text);`);
 await db.exec(await readFile(new URL('../supabase/totus_web_source_identity.sql',import.meta.url),'utf8'));
 const store='00000000-0000-4000-8000-000000000001';
 await db.query(`insert into products(id,store_id,sku,source_website,source_id) values($1,$2,'SAME','web-a',1),($3,$2,'SAME','web-a',2),($4,$2,'SAME','web-b',1)`,['00000000-0000-4000-8000-000000000002',store,'00000000-0000-4000-8000-000000000003','00000000-0000-4000-8000-000000000004']);
 await assert.rejects(()=>db.query(`insert into products(id,sku,source_website,source_id) values($1,'OTHER','web-a',1)`,['00000000-0000-4000-8000-000000000005']),/unique/);
 await assert.rejects(()=>db.query(`insert into products(id,sku,source_website) values($1,'OTHER','web-a')`,['00000000-0000-4000-8000-000000000005']),/check/);
 await db.query(`insert into products(id,store_id,sku) values($1,$2,'MANUAL')`,['00000000-0000-4000-8000-000000000006',store]);
 await assert.rejects(()=>db.query(`insert into products(id,store_id,sku) values($1,$2,' manual ')`,['00000000-0000-4000-8000-000000000007',store]),/unique/);
 await db.exec(`grant usage on schema public to authenticated;grant select,insert,update on products to authenticated;set role authenticated;`);
 await assert.rejects(()=>db.query(`update products set source_website=null,source_id=null where source_website='web-a'`),/identidad/);
 console.log('Source identities: duplicate external references preserved, distinct websites isolated, manual uniqueness retained and source identity protected. Isolated fixture only.');
}finally{await db.close();}
