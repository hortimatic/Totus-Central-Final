import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
import {createCentralProductSyncHistory} from '../src/central-product-sync-history.js';
const actor=crypto.randomUUID(),store=crypto.randomUUID(),other=crypto.randomUUID(),job=crypto.randomUUID(),product=crypto.randomUUID(),external=crypto.randomUUID();
const db=new PGlite();
try{
 await db.exec(`create schema private;create schema auth;create role anon;create role authenticated;
 create function auth.uid() returns uuid language sql as $$select nullif(current_setting('test.actor',true),'')::uuid$$;
 create table profiles(id uuid,active boolean);insert into profiles values('${actor}',true);
 create function private.totus_can(text,text) returns boolean language sql as $$select coalesce(current_setting('test.allow',true),'yes')='yes'$$;
 create function private.totus_local_store_access(uuid) returns boolean language sql as $$select $1='${store}'::uuid$$;
 create table products(id uuid,name text);insert into products values('${product}','Native product');
 create table private.totus_central_product_sync_queue(id uuid,store_id uuid,product_id uuid,status text,updated_at timestamptz,notice text,result jsonb,external_request uuid);
 insert into private.totus_central_product_sync_queue values('${job}','${store}','${product}','conflict',now(),null,null,'${external}');`);
 await db.exec(await readFile('supabase/totus_central_product_sync_controls.sql','utf8'));
 const row=async()=>(await db.query('select * from private.totus_central_product_sync_queue')).rows[0];
 const control=async(action,stamp,shop=store)=>(await db.query('select public.totus_central_product_sync_control($1,$2,$3,$4) result',[shop,job,action,stamp??(await row()).updated_at])).rows[0].result;
 await assert.rejects(()=>control('cancel'),/permiso/);await db.exec(`set test.actor='${actor}'`);
 await assert.rejects(()=>control('cancel',undefined,other),/permiso/);
 await assert.rejects(()=>control(null),/acción/);await assert.rejects(()=>control('cancel','2000-01-01'),/cambiado/);
 await assert.rejects(()=>control('retry'),/conflicto/);
 const stamp=(await row()).updated_at;assert.equal((await control('cancel')).status,'cancelled');
 assert.equal((await row()).external_request,external);assert.equal((await db.query('select name from products')).rows[0].name,'Native product');
 await assert.rejects(()=>control('cancel',stamp),/cambiado/);
 for(const status of ['running','uncertain','completed','cancelled','pending']){await db.query('update private.totus_central_product_sync_queue set status=$1',[status]);await assert.rejects(()=>control('cancel'),/no puede retirarse/);}
 await db.exec(`update private.totus_central_product_sync_queue set status='needs_configuration'`);assert.equal((await control('retry')).status,'pending');assert.equal((await row()).external_request,external);
 await db.exec(`set test.allow='no'`);await assert.rejects(()=>control('cancel'),/permiso/);
 assert.equal((await db.query("select has_function_privilege('anon','public.totus_central_product_sync_control(uuid,uuid,text,timestamptz)','execute') allowed")).rows[0].allowed,false);
}finally{await db.close();}
let owner=actor,allowed=true,pending,request;
const history=createCentralProductSyncHistory({actor:()=>owner,current:()=>true,canEdit:()=>allowed,rpc:async(name,args)=>{request={name,args};if(pending)return pending;return name.endsWith('_status')?{storeId:store,items:[{id:job,status:'conflict',notice:'<script>bad</script>',updatedAt:'2026-01-01'}]}:{storeId:store,id:job,status:'cancelled'};}});
await history.load(store);assert.ok(history.render(store).includes('&lt;script&gt;'));assert.ok(!history.render(other).includes(job));
allowed=false;await assert.rejects(()=>history.control(store,job,'cancel'),/permiso/);allowed=true;
await history.control(store,job,'cancel');assert.equal(request.args.p_expected_updated,'2026-01-01');assert.equal(request.args.p_store,store);
let resolve;pending=new Promise(r=>resolve=r);const task=history.load(store);owner=other;resolve({storeId:store,items:[]});await assert.rejects(()=>task,/sesión/);
console.log('Sync controls: permissions, store isolation, CAS, null actions, uncertain/running protection, native data preservation, original request identity and stale UI sessions verified.');
