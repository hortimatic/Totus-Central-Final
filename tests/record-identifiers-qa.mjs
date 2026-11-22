import assert from 'node:assert/strict';
import {PGlite} from '@electric-sql/pglite';
import {readFile} from 'node:fs/promises';
import {productDisplayId,saleDisplayReference} from '../src/record-identifiers.js';
assert.equal(productDisplayId({__central:true,__sourceProductId:123,id:'uuid'}),'123');
assert.equal(productDisplayId({__native:{display_number:7},id:'uuid'}),'P-000007');
assert.equal(saleDisplayReference({reference:'TC-12',id:'uuid'}),'TC-12');
const db=new PGlite();try{
await db.exec(`create role anon;create role authenticated;create schema private;
create table products(id uuid primary key,created_at timestamptz,source_id bigint);
insert into products values('00000000-0000-0000-0000-000000000002','2026-01-02',null),('00000000-0000-0000-0000-000000000001','2026-01-01',null),('00000000-0000-0000-0000-000000000003','2026-01-01',77);
create table private.totus_tpv_local_sales(id uuid,store_id uuid,created_at timestamptz);
create table private.totus_tpv_local_documents(sale_id uuid,store_id uuid,prefix text,number bigint,data jsonb);
create function public.totus_local_store_workspace(p_store uuid,p_kind text,p_action text,p_id uuid,p_request uuid,p_data jsonb) returns jsonb language sql as $$ select coalesce((select jsonb_agg(to_jsonb(s)||jsonb_build_object('name','Venta '||left(s.id::text,8))) from private.totus_tpv_local_sales s),'[]') $$;`);
await db.exec(await readFile('supabase/totus_display_identifiers.sql','utf8'));
const rows=(await db.query('select source_id,display_number from products order by id')).rows;
assert.deepEqual(rows.map(r=>r.display_number),[1,2,null]);assert.equal(rows[2].source_id,77);
await db.exec(`insert into products(id,created_at) values('00000000-0000-0000-0000-000000000004',now())`);
assert.equal((await db.query('select max(display_number) n from products')).rows[0].n,3);
await db.exec("insert into private.totus_tpv_local_sales values('00000000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000006',now());insert into private.totus_tpv_local_documents values('00000000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000006','TC-',12,'{}');");
const sale=(await db.query("select public.totus_local_store_workspace(null,null,null,null,null,null) value")).rows[0].value[0];assert.equal(sale.reference,'TC-12');assert.equal(sale.name,'Venta TC-12');assert.equal(sale.id,'00000000-0000-0000-0000-000000000005');
console.log('PASS original IDs preserved; local chronological sequence; no UUID display; receipt reader repaired');
}finally{await db.close();}
