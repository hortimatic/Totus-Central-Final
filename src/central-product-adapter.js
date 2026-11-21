import {createCentralStoreData} from './central-store-data.js?v=359288e44b47ddb2d1b7fc043cafd5e7dc4cbd00';

const clone=value=>structuredClone(value);
const cents=n=>Number(n)/100;
const firstCatalogue=p=>p.catalogue.find(c=>!c.variant_id)||p.catalogue[0]||null;
const languages=p=>{
 const raw=p.details?.sourceData||{};
 const entries=['name','description','description_short','meta_title','meta_description','link_rewrite'].flatMap(key=>Array.isArray(raw[key])?raw[key]:[]);
 const ids=[...new Set(entries.map(e=>String(e?.id??e?.language_id??'')).filter(id=>/^[1-9]\d*$/.test(id)))];
 return ids.length?ids:['1'];
};
export function centralProductRecord(p){
 const c=firstCatalogue(p),raw=clone(p.details?.sourceData||{}),rate=Number(c?.tax_basis_points||0)/10000;
 return {...raw,__central:true,__native:p,__sourceWebsite:p.source_website||null,__sourceProductId:p.source_id||raw.id||null,id:p.id,name:p.name,reference:p.sku||'',
  price:c?String(cents(c.price_cents)/(1+rate)):'',__grossCents:c?.price_cents??null,__taxBasisPoints:c?.tax_basis_points??null,
  active:c?.active?'1':'0',ean13:c?.ean||'',id_manufacturer:p.brand_id||'0',id_supplier:p.supplier_id||'0',
  meta_title:p.details?.metaTitle??raw.meta_title??'',meta_description:p.details?.metaDescription??raw.meta_description??'',
  link_rewrite:p.details?.slug??raw.link_rewrite??'',description:p.details?.description??raw.description??'',
  description_short:p.details?.descriptionShort??raw.description_short??'',date_add:p.created_at,date_upd:p.updated_at,
  __language_ids:languages(p),associations:{...raw.associations,combinations:p.variants.map(v=>({id:v.id}))}};
}
// The legacy product view and Central's TPV consume the same persistent records.
// No PrestaShop request is made here; connection status never gates a local read.
export function createCentralProductAdapter({rpc,actor}){
 const data=createCentralStoreData({rpc,actor}),catalogues=new Map(),resources=new Map(),projections=new Map();let choices=[],contextOwner=null;
 const auxiliaryKinds=new Set(['languages','categories','product_options','product_option_values','product_features','product_feature_values','tags','tax_rule_groups','tax_rules','taxes','countries']);
 async function context(){const owner=actor();if(owner!==contextOwner){choices=[];catalogues.clear();resources.clear();projections.clear();contextOwner=null;}const next=await data.stores();choices=next;contextOwner=owner;for(const key of catalogues.keys())if(!choices.some(s=>s.id===key))catalogues.delete(key);for(const cache of [resources,projections])for(const key of cache.keys())if(!choices.some(s=>key.startsWith(s.id+'|')))cache.delete(key);return {stores:clone(choices)};}
 function ensure(store){if(!contextOwner||contextOwner!==actor()||!choices.some(s=>s.id===store))throw Error('La tienda ya no está disponible. Actualiza la selección.');}
 async function catalogue(store,{fresh=false}={}){
  ensure(store);if(fresh)catalogues.delete(store);
  if(!catalogues.has(store)){
   const owner=actor();
   const promise=rpc('totus_local_store_workspace',{p_store:store,p_kind:'products'}).then(result=>{
    if(actor()!==owner||result?.storeId!==store||!Array.isArray(result.items))throw Error('La sesión o la tienda cambió durante la consulta.');
    const seen=new Set();for(const p of result.items){if(p.store_id!==store||seen.has(p.id)||!Array.isArray(p.variants)||!Array.isArray(p.catalogue))throw Error('Catálogo de otra tienda o incompleto.');seen.add(p.id);}
    return result.items;
   });catalogues.set(store,promise);promise.catch(()=>{if(catalogues.get(store)===promise)catalogues.delete(store);});
  }
  const pending=catalogues.get(store),result=await pending;ensure(store);
  if(catalogues.get(store)!==pending)throw Error('El catálogo cambió durante la consulta. Actualiza la selección.');
  return clone(result);
 }
 async function product(store,id){ensure(store);return data.detail({store,kind:'products',id});}
 async function directory(store,kind){ensure(store);return data.all({store,kind});}
 async function auxiliary(store,resource,{fresh=false}={}){
  ensure(store);if(!auxiliaryKinds.has(resource))throw Error('Recurso auxiliar no válido.');
  const key=store+'|'+resource;if(fresh)resources.delete(key);
  if(!resources.has(key)){
   const owner=actor(),promise=(async()=>{
    if(['product_options','product_option_values','product_features','product_feature_values'].includes(resource)){
     const result=await rpc('totus_central_attribute_catalogue',{p_store:store,p_resource:resource});ensure(store);
     if(actor()!==owner||result?.storeId!==store||result.resource!==resource||!Array.isArray(result.items))throw Error('Atributos de otra tienda o incompletos.');
     const seen=new Set();for(const row of result.items){const id=String(row.id||'');if(!/^(?:[1-9]\d{0,14}|[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})$/i.test(id)||seen.has(id)||typeof row.__revision!=='string')throw Error('Atributo repetido o sin identidad verificable.');seen.add(id);}
     return result.items;
    }
    const rows=[],seen=new Set();let after=0,revision,website;
    for(;;){
     ensure(store);if(actor()!==owner)throw Error('La sesión cambió durante la consulta.');
     const result=await rpc('totus_central_product_resources',{p_store:store,p_resource:resource,p_after:after,p_limit:100});
     ensure(store);if(actor()!==owner||result?.storeId!==store||result.resource!==resource||!Array.isArray(result.items)||!Number.isSafeInteger(result.revision)||result.revision<0)throw Error('Recurso auxiliar ajeno a la tienda o incompleto.');
     if(revision!==undefined&&(revision!==result.revision||website!==result.website))throw Error('Los datos auxiliares cambiaron durante la lectura. Actualiza para repetirla.');
     revision=result.revision;website=result.website;
     for(const row of result.items){const id=Number(row.id);if(!Number.isSafeInteger(id)||id<=after||seen.has(id))throw Error('Datos auxiliares repetidos o fuera de orden.');seen.add(id);rows.push(row);}
     if(result.nextCursor===null)return rows;
     const next=result.nextCursor;if(!Number.isSafeInteger(next)||next<=after||next!==Number(result.items.at(-1)?.id))throw Error('La lectura auxiliar no avanzó.');after=next;
    }
   })();resources.set(key,promise);promise.catch(()=>{if(resources.get(key)===promise)resources.delete(key);});
  }
  const pending=resources.get(key),rows=await pending;ensure(store);if(resources.get(key)!==pending)throw Error('Los datos auxiliares cambiaron. Actualiza la selección.');return clone(rows);
 }
 async function project(store,resource){
  let rows;
  if(resource==='products')rows=(await catalogue(store)).map(centralProductRecord);
  else if(['manufacturers','suppliers'].includes(resource))rows=(await directory(store,resource==='manufacturers'?'brands':'suppliers')).map(row=>({...row,active:'1'}));
  else if(resource==='combinations')rows=(await catalogue(store)).flatMap(p=>p.variants.map(v=>{const c=p.catalogue.find(c=>c.variant_id===v.id);return {...v,__central:true,id_product:p.id,reference:v.sku||'',ean13:c?.ean||'',price:c?String(cents(c.price_cents)):'',__attributes:Object.entries(v.attributes||{}).map(([group,value])=>({group,value})),associations:{}};}));
  else if(resource==='stock_availables')rows=(await catalogue(store)).flatMap(p=>p.catalogue.map(c=>({id:c.id,id_product:p.id,id_product_attribute:c.variant_id||'0',id_shop:'0',quantity:c.stock})));
  else if(resource==='association_inventory')rows=(await catalogue(store)).map(p=>({id:p.id,name:p.name,reference:p.sku||'',__central:true,__sourceWebsite:p.source_website||null,
   id_default_image:p.details?.sourceData?.id_default_image||'',associations:{product_features:clone(p.details?.sourceData?.associations?.product_features||[])},
   variants:p.variants.map(v=>({id:v.id,id_product:p.id,__central:true,__attributes:Object.entries(v.attributes||{}).map(([group,value])=>({group,value}))}))}));
  else if(auxiliaryKinds.has(resource))rows=await auxiliary(store,resource);
  else throw Error('El recurso necesita su adaptador de datos de Central: '+resource);
  return rows;
 }
 async function snapshot(store,resource){
  ensure(store);const key=store+'|'+resource;
  if(!projections.has(key)){const pending=project(store,resource);projections.set(key,pending);pending.catch(()=>{if(projections.get(key)===pending)projections.delete(key);});}
  const pending=projections.get(key),rows=await pending;ensure(store);if(projections.get(key)!==pending)throw Error('El catálogo cambió durante la consulta. Actualiza la selección.');return rows;
 }
 async function read(store,resource,{id=null,search='',page=0,size=100,product_ids=null,references=null,search_field=null}={}){
  ensure(store);if(!Number.isSafeInteger(page)||page<0||!Number.isInteger(size)||size<1||size>100||!Number.isSafeInteger(page*size))throw Error('Página no válida.');
  let rows=id&&resource==='products'?[centralProductRecord(await product(store,id))]:await snapshot(store,resource);
  if(id)rows=rows.filter(r=>r.id===id);
  if(product_ids!==null){if(!Array.isArray(product_ids)||product_ids.some(v=>typeof v!=='string'||!v))throw Error('Identificadores de producto no válidos.');const ids=new Set(product_ids);rows=rows.filter(r=>ids.has(String(resource==='products'?r.id:r.id_product)));}
  if(references!==null){if(!Array.isArray(references)||references.some(v=>typeof v!=='string'||!v))throw Error('Referencias no válidas.');const refs=new Set(references);rows=rows.filter(r=>refs.has(String(r.reference||'')));}
  if(search){const needle=search.toLocaleLowerCase('es'),fields=search_field?[search_field]:['name','reference','ean13'];if(fields.some(f=>!['name','reference','ean13'].includes(f)))throw Error('Campo de búsqueda no válido.');rows=rows.filter(r=>fields.some(f=>String(r[f]||'').toLocaleLowerCase('es').includes(needle)));}
  const start=page*size;return {rows:clone(rows.slice(start,start+size)),possibly_more:start+size<rows.length,total:rows.length};
 }
 async function associations(store){const rows=await snapshot(store,'association_inventory');return clone({products:rows.map(({variants,...p})=>p),combinations:rows.flatMap(p=>p.variants)});}
 function invalidate(store){if(store){catalogues.delete(store);for(const cache of [resources,projections])for(const key of cache.keys())if(key.startsWith(store+'|'))cache.delete(key);}else{catalogues.clear();resources.clear();projections.clear();}data.invalidate();}
 return {context,catalogue,product,directory,auxiliary,associations,read,invalidate,get stores(){return clone(choices);}};
}
