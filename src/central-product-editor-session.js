import {centralProductEditPayload,verifyCentralProductEdit} from './central-product-edit.js?v=88ad0bcc1b93534c17e8fd43e64c3b0b505832bd';
import {sha256Text} from './productos-write-contract.js?v=88ad0bcc1b93534c17e8fd43e64c3b0b505832bd';
const uuid=value=>typeof value==='string'&&/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(value);
const clone=value=>structuredClone(value);
const token=(store,args)=>store+'|'+args.resource+'|'+args.record_id;
// Adapts the existing Products prepare/commit controls to native Central saves.
// The full frozen payload is kept before sending; receipt reconciliation uses
// the existing native journal instead of trusting an unchanged-looking screen.
export function createCentralProductEditorSession({data,rpc,actor,canEdit,current,storage=localStorage}){
 const prepared=new Map();let epoch=0;
 function scope(){const owner=actor(),generation=epoch;if(!owner||!canEdit()||!current())throw Error('No tienes permiso para editar este producto.');return {owner,key:'totus.central-product-edits.v1:'+owner,guard(){if(owner!==actor()||generation!==epoch||!canEdit()||!current())throw Error('La sesión o el permiso de Productos ha cambiado.');}};}
 function load(s){s.guard();const value=JSON.parse(storage.getItem(s.key)||'{}');if(!value||typeof value!=='object'||Array.isArray(value))throw Error('El diario local de productos no es válido.');return value;}
 function keep(s,entries){s.guard();const completed=Object.entries(entries).filter(([,value])=>value.completed).sort((a,b)=>(a[1].finishedAt||0)-(b[1].finishedAt||0));for(const [key]of completed.slice(0,Math.max(0,completed.length-64)))delete entries[key];const serialized=JSON.stringify(entries);storage.setItem(s.key,serialized);if(storage.getItem(s.key)!==serialized)throw Error('No se ha podido conservar la solicitud. No se ha enviado el guardado.');}
 function checkEntry(entry,store,args){if(entry.store!==store||entry.resource!==args.resource||entry.id!==args.record_id||!uuid(entry.parentId)||!uuid(entry.backendId)||JSON.stringify(entry.changes)!==JSON.stringify(args.changes))throw Error('La solicitud guardada corresponde a otros cambios.');}
 async function receipt(s,entry,cancel){const result=await rpc('totus_central_product_save_receipt',{p_store:entry.store,p_id:entry.parentId,p_request:entry.backendId,p_data:entry.payload||null,p_cancel_absent:cancel});s.guard();if(result?.storeId!==entry.store||result.id!==entry.parentId||!['saved','cancelled','absent'].includes(result.receipt))throw Error('La comprobación no corresponde al producto guardado.');return result;}
 async function invoke(store,action,args){
  const s=scope();if(!uuid(store)||!['products','combinations'].includes(args?.resource)||!uuid(args.record_id))throw Error('Identidad de producto no válida.');
  const key=token(store,args),entries=load(s);
  if(action==='prestashop_product_prepare'){
   const pending=Object.entries(entries).filter(([,entry])=>entry.store===store&&entry.resource===args.resource&&entry.id===args.record_id&&entry.attempted&&!entry.completed);
   if(pending.length>1)throw Error('Hay varias solicitudes pendientes de esta ficha. Comprueba sus resultados antes de editar.');
   if(pending.length){const [frontId,entry]=pending[0];checkEntry(entry,store,args);const found=await receipt(s,entry,true);
    if(found.receipt==='saved'){data.invalidate(store);const actual=await data.product(store,entry.parentId);s.guard();verifyCentralProductEdit(actual,entry.payload,entry.resource,entry.id,entry.changes);entry.completed=true;entry.payload=null;entry.finishedAt=Date.now();entry.receipt=found;}
    else if(found.receipt==='cancelled'){entry.backendId=crypto.randomUUID();entry.attempted=false;entry.payload=null;entry.receipt=null;}
    else throw Error('La solicitud anterior todavía no puede revisarse.');entries[frontId]=entry;keep(s,entries);
   }
   const parentId=args.resource==='products'?args.record_id:args.expected_product_id;if(!uuid(parentId))throw Error('Selecciona el producto padre de la combinación.');
   const product=await data.product(store,parentId);s.guard();const built=centralProductEditPayload(product,args.resource,args.record_id,args.changes);
   const fingerprint=await sha256Text(JSON.stringify({store,resource:args.resource,id:args.record_id,payload:built.payload,changes:built.changes}));s.guard();
   prepared.set(key,{parentId,payload:built.payload,changes:built.changes,fingerprint});
   return {ok:true,store,resource:args.resource,record_id:args.record_id,persisted:false,fingerprint,can_commit:true,changes:built.review,native:true};
  }
  if(action!=='prestashop_product_commit'||!uuid(args.request_id)||args.confirmed!==true)throw Error('Revisa y confirma el guardado del producto.');
  let entry=entries[args.request_id];
  if(entry){checkEntry(entry,store,args);if(entry.completed){const found=await receipt(s,entry,false);if(found.receipt!=='saved')throw Error('El servidor no confirma el resultado anterior.');data.invalidate(store);return {ok:true,store,resource:args.resource,record_id:args.record_id,persisted:true,verified:true,queued:found.queued||0,native:true,recovered:true};}}
  if(!entry||!entry.attempted){const review=prepared.get(key);if(!review||review.fingerprint!==args.expected_fingerprint||JSON.stringify(review.changes)!==JSON.stringify(args.changes))throw Error('La revisión ha cambiado. Vuelve a comprobar la ficha antes de guardar.');entry={store,resource:args.resource,id:args.record_id,parentId:review.parentId,backendId:entry?.backendId||args.request_id,payload:clone(review.payload),changes:clone(review.changes),fingerprint:review.fingerprint,attempted:true,completed:false};entries[args.request_id]=entry;keep(s,entries);}
  else if(entry.fingerprint!==args.expected_fingerprint&&!args.recover_unchanged)throw Error('Conserva la huella de la solicitud enviada.');
  const response=await rpc('totus_central_product_save',{p_store:store,p_id:entry.parentId,p_request:entry.backendId,p_data:clone(entry.payload),p_changes:{resource:entry.resource,recordId:entry.id,changes:clone(entry.changes)}});s.guard();
  if(response?.storeId!==store||response.id!==entry.parentId||response.saved!==true)throw Error('El producto no está confirmado. Conserva la solicitud para comprobarla.');
  data.invalidate(store);const actual=await data.product(store,entry.parentId);s.guard();
  if(actual.id!==entry.parentId||actual.store_id!==store)throw Error('No se pudo releer la ficha de esta tienda.');
  verifyCentralProductEdit(actual,entry.payload,entry.resource,entry.id,entry.changes);
  // The original result remains recoverable even if another operator has since
  // edited the record. Never replay it as a new write over a later revision.
  entry.completed=true;entry.payload=null;entry.finishedAt=Date.now();entry.receipt=response;entries[args.request_id]=entry;keep(s,entries);prepared.delete(key);
  return {ok:true,store,resource:args.resource,record_id:args.record_id,persisted:true,verified:true,queued:response.queued||0,native:true};
 }
 return {invoke,dispose(){epoch++;prepared.clear();}};
}
