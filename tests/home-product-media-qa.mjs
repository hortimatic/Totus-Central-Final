import assert from 'node:assert/strict';
import {PGlite} from '@electric-sql/pglite';
import {readFile} from 'node:fs/promises';
import {nativeHomeRead} from '../src/home-tpv.js';
const db=new PGlite();
const store='00000000-0000-0000-0000-000000000002',id='00000000-0000-0000-0000-000000000003';
try{
await db.exec(`create schema auth;create schema private;create role anon;create role authenticated;
create function auth.uid() returns uuid language sql as $$select '00000000-0000-0000-0000-000000000001'::uuid$$;
create table profiles(id uuid,active boolean);insert into profiles values(auth.uid(),true);
create function private.totus_can(text,text) returns boolean language sql as $$select true$$;
create function private.totus_local_store_access(uuid) returns boolean language sql as $$select $1='${store}'$$;
create table products(id uuid,store_id uuid,source_website text,details jsonb);
create table private.totus_websites(key text,origin text);
create table private.totus_tpv_local_catalogue(id uuid,product_id uuid,store_id uuid,metadata jsonb);
insert into products values('${id}','${store}','shop','{"sourceData":{"id_default_image":"123"}}');
insert into private.totus_websites values('shop','https://example.test');
insert into private.totus_tpv_local_catalogue values('${id}','${id}','${store}','{}');`);
await db.exec(await readFile('supabase/totus_home_product_media.sql','utf8'));
const result=(await db.query(`select public.totus_home_product_media('${store}',array['${id}']::uuid[]) value`)).rows[0].value;
assert.equal(result.items[0].imageUrl,'https://example.test/123-home_default/product.jpg');
await assert.rejects(()=>db.query(`select public.totus_home_product_media('${id}',array['${id}']::uuid[])`));
await db.exec(`update private.totus_tpv_local_catalogue set metadata='{"imageUrl":"https://example.test/local.jpg"}'`);
assert.equal((await db.query(`select public.totus_home_product_media('${store}',array['${id}']::uuid[]) value`)).rows[0].value.items[0].imageUrl,'https://example.test/local.jpg');
const summary={top:[{id,name:'Product',quantity:1}],series:[]};
const read=nativeHomeRead([summary],store,{from:'2026-11-01',to:'2026-11-30'},[{id:'sale',store_id:store,created_at:'2026-11-20T12:00:00Z',total_cents:100,snapshot:{lines:[{productId:id,name:'Product',qty:1,totalCents:100,netCents:83}]}}],new Map([[id,result.items[0].imageUrl]]));
assert.equal(read.top[0].image,result.items[0].imageUrl);assert.equal(read.detailsByOrder.get('sale')[0].image,result.items[0].imageUrl);
console.log('PASS saved product images, local precedence, store isolation and sale/top hydration');
}finally{await db.close();}
