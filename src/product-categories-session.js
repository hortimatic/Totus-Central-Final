import {createDirectorySession} from './contact-directory-session.js?v=2e9766c23a8517ea98025b755dd0c0dee5a82032';
import {categoryFields,categoryHierarchy} from './product-categories-core.js?v=2e9766c23a8517ea98025b755dd0c0dee5a82032';
export function createCategorySession({rpc,invoke,actor,can}){
 let owner=null,store=null,context=null,generation=0,busy=false;
 const intents=new Map(),directory=createDirectorySession({kind:'categorias',rpc,invoke,actor,can});
 const current=(who,n)=>owner===who&&actor()===who&&generation===n&&can('view');
 const ensure=(who,n)=>{if(!current(who,n))throw Error('La cuenta o la tienda ha cambiado. Abre sus categorías de nuevo.');};
 async function load(next=store){
  const who=actor(),n=next===store&&owner===who?generation:++generation;owner=who;store=next;
  if(!who||!can('view'))throw Error('No tienes acceso a las categorías.');
  const value=await rpc('totus_category_workspace',{p_store:store});ensure(who,n);
  if(value?.storeId!==store||!Array.isArray(value.items)||!Array.isArray(value.languages)||!Number.isSafeInteger(value.revision))throw Error('Las categorías no corresponden a la tienda seleccionada.');
  categoryHierarchy(value.items);context=value;return structuredClone(context);
 }
 async function synchronize(){
  if(busy||!context?.connected)throw Error('Comprueba la conexión de esta tienda.');
  const who=owner,n=generation,shop=store;busy=true;
  try{const result=await invoke({action:'central_category_sync',store_id:shop});ensure(who,n);if(result?.storeId!==shop||result.verified!==true)throw Error('No se ha confirmado la sincronización de esta tienda.');return await load(shop);}finally{busy=false;}
 }
 async function save(id,input){
  if(busy||!context)throw Error('Espera a que termine la lectura.');
  if(!can(id?'edit':'create'))throw Error('No tienes permiso para guardar categorías.');
  const fields=categoryFields(input,context.items,{id,physical:!context.website}),who=owner,n=generation,shop=store,website=context.website;
  const key=JSON.stringify([owner,shop,website,id,fields]);busy=true;
  try{
   let result;
   if(website){
    if(!context.connected)throw Error('Reconecta y verifica la web antes de publicar sus categorías.');
    await directory.enter(website);ensure(who,n);
    result=await directory.publish('categories',id,fields,id?'update':'create');ensure(who,n);
   }else{
    const request=intents.get(key)||crypto.randomUUID();intents.set(key,request);
    result=await rpc('totus_category_local_save',{p_store:shop,p_request:request,p_id:id,p_revision:context.revision,p_fields:fields});ensure(who,n);
    if(result?.storeId!==shop||result.verified!==true)throw Error('No se confirmó el guardado en esta tienda.');intents.delete(key);
   }
   return {...result,webPublished:!!website};
  }finally{busy=false;}
 }
 return {load,synchronize,save,get context(){return context?structuredClone(context):null;},get busy(){return busy;},dispose(){generation++;owner=null;store=null;context=null;directory.dispose();}};
}
