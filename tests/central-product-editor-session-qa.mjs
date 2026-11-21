import assert from 'node:assert/strict';
import {createCentralProductEditorSession} from '../src/central-product-editor-session.js';
const store=crypto.randomUUID(),id=crypto.randomUUID(),request=crypto.randomUUID();
let product={id,store_id:store,name:'Original',sku:'REF',updated_at:'2026-11-21',details:{},variants:[],catalogue:[{id,price_cents:1210,tax_basis_points:2100,stock:3,revision:1,active:true,quantity_unit:'unit'}]};
const entries=new Map(),receipts=new Map(),writes=[];
let loseResponse=true,owner='operator';
const storage={getItem:key=>entries.get(key)??null,setItem:(key,value)=>entries.set(key,value)};
const data={product:async()=>structuredClone(product),invalidate(){}};
const rpc=async(name,args)=>{
 if(name==='totus_central_product_save_receipt')return {storeId:store,id,receipt:receipts.has(args.p_request)?'saved':'cancelled'};
 assert.equal(name,'totus_central_product_save');writes.push(structuredClone(args));
 if(!receipts.has(args.p_request)){
  product={...product,name:args.p_data.name,details:{...product.details,...args.p_data},updated_at:'2026-11-22'};
  receipts.set(args.p_request,true);
 }
 if(loseResponse){loseResponse=false;throw Error('Response lost');}
 return {storeId:store,id,saved:true,queued:0};
};
const create=()=>createCentralProductEditorSession({data,rpc,storage,actor:()=>owner,canEdit:()=>true,current:()=>true});
const args={resource:'products',record_id:id,changes:[{field:'reference',value:'NEW-REF'}]};
// Apply a scalar that can be independently read back from the saved record.
const originalRpc=rpc;
const guardedRpc=async(name,args)=>{try{return await originalRpc(name,args);}finally{if(name==='totus_central_product_save')product.sku=args.p_data.reference;}};
const session=()=>createCentralProductEditorSession({data,rpc:guardedRpc,storage,actor:()=>owner,canEdit:()=>true,current:()=>true});
let editor=session();const preview=await editor.invoke(store,'prestashop_product_prepare',args);
const commit={...args,request_id:request,expected_fingerprint:preview.fingerprint,confirmed:true};
await assert.rejects(editor.invoke(store,'prestashop_product_commit',commit),/Response lost/);
assert.equal(writes.length,1);assert.ok(entries.size,'Intent survives a lost reply');editor.dispose();
editor=session();const recovered=await editor.invoke(store,'prestashop_product_commit',commit);
assert.equal(recovered.verified,true);assert.equal(writes.length,2);assert.equal(writes[0].p_request,writes[1].p_request,'Replay uses original request, never a new sale-like mutation');
await editor.invoke(store,'prestashop_product_commit',commit);assert.equal(writes.length,2,'Completed replay checks receipt without another write');
const failingStorage={getItem:()=>null,setItem:()=>{throw Error('Storage unavailable');}};
const blocked=createCentralProductEditorSession({data,rpc:guardedRpc,storage:failingStorage,actor:()=>owner,canEdit:()=>true,current:()=>true});
const next=await blocked.invoke(store,'prestashop_product_prepare',args);
await assert.rejects(blocked.invoke(store,'prestashop_product_commit',{...commit,request_id:crypto.randomUUID(),expected_fingerprint:next.fingerprint}),/Storage unavailable/);
assert.equal(writes.length,2,'No request leaves the browser when durable intent cannot be stored');
owner=null;await assert.rejects(editor.invoke(store,'prestashop_product_prepare',args),/permiso/);
console.log('Native editor session: lost reply, persisted intent, same-request replay, authoritative readback, completed receipt, storage failure and actor isolation verified.');
