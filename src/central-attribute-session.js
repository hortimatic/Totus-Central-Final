const resources=new Set(['product_options','product_option_values','product_features','product_feature_values']);
// Same editor contract as the existing directory session, backed by owned data.
export function createCentralAttributeSession({data,rpc,actor,can}){
 let store=null,owner=null,generation=0,busy=false;const rows=new Map(),requests=new Map();
 const ensure=(who,n)=>{if(!who||actor()!==who||owner!==who||n!==generation||!can('view'))throw Error('La cuenta o la tienda ha cambiado. Abre de nuevo el editor.');};
 async function enter(next){if(busy)throw Error('Hay un guardado en curso.');const who=actor(),n=++generation;owner=who;store=null;rows.clear();if(!who||!can('view'))throw Error('No tienes acceso a los atributos.');const context=await data.context();ensure(who,n);if(!context.stores.some(s=>s.id===next))throw Error('La tienda ya no está disponible.');store=next;}
 async function read(resource,{record_id=null}={}){
  const who=owner,n=generation;ensure(who,n);if(!store||!resources.has(resource)&&resource!=='languages')throw Error('Tipo de atributo no válido.');
  let items=await data.auxiliary(store,resource);ensure(who,n);
  if(resource==='languages'&&!items.length)items=[{id:'1',iso_code:'es',active:'1',name:'Español'}];
  for(const item of items)rows.set(resource+'|'+item.id,structuredClone(item));
  return {store,resource,complete:true,rows:structuredClone(record_id===null?items:items.filter(r=>String(r.id)===String(record_id)))};
 }
 async function publish(resource,recordId,fields,operation='update'){
  const permission={create:'create',update:'edit',delete:'delete'}[operation],who=owner,n=generation;ensure(who,n);
  if(!resources.has(resource)||!permission||!can(permission)||busy)throw Error('No tienes permiso para guardar este atributo.');
  const previous=recordId?rows.get(resource+'|'+recordId):null;if(operation!=='create'&&!previous?.__revision)throw Error('Abre el atributo antes de modificarlo.');
  const identity={p_store:store,p_resource:resource,p_operation:operation,p_id:operation==='create'?null:String(recordId),p_fields:fields,p_revision:previous?.__revision||null};
  const key=JSON.stringify(identity);if(!requests.has(key))requests.set(key,crypto.randomUUID());busy=true;
  try{
   const result=await rpc('totus_central_attribute_save',{...identity,p_request:requests.get(key)});ensure(who,n);
   if(result?.storeId!==store||result.resource!==resource||result.saved!==true||!result.recordId||operation!=='create'&&String(result.recordId)!==String(recordId))throw Error('El guardado no ha confirmado el atributo de esta tienda.');
   data.invalidate(store);const verified=(await read(resource,{record_id:result.recordId})).rows;
   if(operation==='delete'?verified.length!==0:verified.length!==1||Object.entries(fields).some(([field,value])=>String(verified[0][field]??'')!==String(value)))throw Error('El cambio está enviado, pero no se ha podido verificar. Conserva este formulario para reintentarlo.');
   requests.delete(key);return {...result,persisted:true,verified:true,record_id:result.recordId};
  }finally{busy=false;}
 }
 return {enter,read,publish,dispose(){generation++;store=null;owner=null;rows.clear();},get publishing(){return busy;}};
}
