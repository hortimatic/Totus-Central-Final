import assert from 'node:assert/strict';
import {PGlite} from '@electric-sql/pglite';
import {readFile} from 'node:fs/promises';
import {createHomeReader,homeTpvContent} from '../src/home-tpv.js';
const db=new PGlite();
try{
 await db.exec(`create schema private;create schema auth;create role anon;create role authenticated;
 create function auth.uid() returns uuid language sql as $$select '00000000-0000-0000-0000-000000000001'::uuid$$;
 create table profiles(id uuid,active boolean);insert into profiles values(auth.uid(),true);
 create function private.totus_can(text,text) returns boolean language sql as $$select true$$;
 create function private.totus_local_store_access(uuid) returns boolean language sql as $$select $1='00000000-0000-0000-0000-000000000002'$$;
 create table private.totus_tpv_local_sales(id uuid,snapshot jsonb,total_cents bigint,store_id uuid,created_at timestamptz);
 create table private.totus_tpv_local_refunds(lines jsonb,total_cents bigint,store_id uuid,status text,created_at timestamptz,sale_id uuid);
 create table private.totus_tpv_local_payments(method text,amount_cents bigint,sale_id uuid,created_at timestamptz);
 create table private.totus_tpv_local_catalogue(id uuid,product_id uuid,variant_id uuid,ean text,store_id uuid);
 create table products(id uuid,details jsonb,store_id uuid);create table product_variants(id uuid,cost_net numeric,product_id uuid);
 insert into private.totus_tpv_local_sales values('00000000-0000-0000-0000-000000000003','{"lines":[]}',1210,'00000000-0000-0000-0000-000000000002','2026-11-21');`);
 await db.exec(await readFile('supabase/totus_home_tpv_summary.sql','utf8'));
 const r=(await db.query("select public.totus_home_tpv_summary('00000000-0000-0000-0000-000000000002','2026-11-21','2026-11-21') r")).rows[0].r;
 assert.equal(r.salesCents,1210);assert.equal(r.saleCount,1);assert.equal(r.source,'totustpv');
 await assert.rejects(()=>db.query("select public.totus_home_tpv_summary('00000000-0000-0000-0000-000000000004','2026-11-21','2026-11-21')"));
}finally{await db.close();}
let calls=0;const reader=createHomeReader(async()=>{calls++;return {storeId:'s',from:'a',to:'b',source:'totustpv'};});await Promise.all([reader.read('s','a','b'),reader.read('s','a','b')]);assert.equal(calls,1);
assert.ok(homeTpvContent({type:'home.income'},{salesCents:1210,refundCents:0}).includes('12,10'));
console.log('Native home summary: store isolation, period and cached reads verified');
