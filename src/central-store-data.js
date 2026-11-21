// Shared access to Central-owned records. A website is an optional connection,
// never the identity of a shop or a prerequisite for reading its saved data.
const kinds=new Set(['products','customers','suppliers','brands']);
const uuid=value=>typeof value==='string'&&/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(value);
export function chooseCentralStore(owner,stores,preferred=''){
 const ids=stores.map(s=>s.id||s.key),key='totus.central-store.v1:'+owner;let saved='';
 try{saved=localStorage.getItem(key)||'';if(saved&&!ids.includes(saved))localStorage.removeItem(key);}catch{}
 return ids.includes(preferred)?preferred:ids.includes(saved)?saved:ids[0]||'';
}
export function rememberCentralStore(owner,store){if(owner&&uuid(store))try{localStorage.setItem('totus.central-store.v1:'+owner,store);}catch{}}
export function createCentralStoreData({rpc,actor}){
 let generation=0;
 const invalidate=()=>{generation++;};
 async function call(name,args){
  const owner=actor(),version=generation;
  if(!owner)throw Error('Inicia sesión.');
  const result=await rpc(name,args);
  if(actor()!==owner||version!==generation)throw Error('La sesión o la selección ha cambiado.');
  return result;
 }
 async function stores(){
  const result=await call('totus_local_store_workspace',{p_kind:'context'});
  if(!Array.isArray(result?.stores))throw Error('No se pudieron comprobar las tiendas.');
  const seen=new Set();
  return result.stores.map(store=>{
   if(!uuid(store.id)||seen.has(store.id)||typeof store.name!=='string'||!store.name.trim())throw Error('Listado de tiendas no válido.');
   seen.add(store.id);
   return {...store,key:store.id,label:store.name};
  });
 }
 async function page({store,kind,search='',after=null,limit=100,id=null}){
  if(!uuid(store)||!kinds.has(kind)||id!==null&&!uuid(id)||typeof search!=='string'||search.length>200||!Number.isInteger(limit)||limit<1||limit>100)throw Error('Consulta de Central no válida.');
  const result=await call('totus_local_store_read_page',{p_store:store,p_kind:kind,p_search:search,p_after:after,p_limit:limit,p_id:id});
  if(result?.storeId!==store||!Array.isArray(result.items)||!Number.isSafeInteger(result.total)||result.total<0)throw Error('Respuesta ajena a la tienda o incompleta.');
  const seen=new Set();
  for(const row of result.items){
   if(!uuid(row.id)||row.store_id!==store||seen.has(row.id)||id!==null&&row.id!==id)throw Error('Registro ajeno a la tienda o repetido.');
   seen.add(row.id);
  }
  const next=result.nextCursor;
  if(next!==null&&(!next||typeof next.name!=='string'||!uuid(next.id)||!result.items.length))throw Error('Continuación del catálogo no válida.');
  return result;
 }
 async function all({store,kind,search='',onPage=()=>{}}){
  const owner=actor(),version=generation;
  const valid=()=>{if(!owner||actor()!==owner||version!==generation)throw Error('La sesión o la selección ha cambiado.');};
  const items=[],seen=new Set(),cursors=new Set();let after=null;
  for(;;){
   valid();
   const result=await page({store,kind,search,after});
   for(const row of result.items){if(seen.has(row.id))throw Error('El catálogo cambió durante la lectura. Actualiza para volver a consultarlo.');seen.add(row.id);items.push(row);}
   await onPage({loaded:items.length,total:result.total});
   valid();
   if(!result.nextCursor)return items;
   const key=JSON.stringify([result.nextCursor.name,result.nextCursor.id]);
   if(cursors.has(key))throw Error('La página del catálogo no avanzó.');
   cursors.add(key);after=result.nextCursor;
  }
 }
 async function detail({store,kind,id}){
  const result=await page({store,kind,id,limit:1});
  if(result.items.length!==1)throw Error('El registro ya no está disponible en esta tienda.');
  return result.items[0];
 }
 async function records({store,kind}){
  if(!uuid(store)||!kinds.has(kind))throw Error('Consulta de Central no válida.');
  const result=await call('totus_local_store_workspace',{p_store:store,p_kind:kind});
  if(result?.storeId!==store||!Array.isArray(result.items))throw Error('Respuesta ajena a la tienda o incompleta.');
  const seen=new Set();
  for(const row of result.items){if(!uuid(row.id)||row.store_id!==store||seen.has(row.id))throw Error('Registro ajeno a la tienda o repetido.');seen.add(row.id);}
  return result.items;
 }
 async function sales({store}){
  if(!uuid(store))throw Error('Selecciona una tienda válida.');
  const result=await call('totus_local_store_workspace',{p_store:store,p_kind:'sales'});
  if(result?.storeId!==store||!Array.isArray(result.items)||result.items.some(r=>r.store_id!==store||!uuid(r.id)))throw Error('Ventas de otra tienda o incompletas.');
  return result.items;
 }
 return {stores,page,all,detail,records,sales,invalidate};
}
