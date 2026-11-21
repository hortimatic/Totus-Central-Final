import {createCentralStoreData} from './central-store-data.js?v=5730da912ef907468e64e8dab0858d8621bf5093';

const clone=value=>structuredClone(value);
const cents=n=>Number(n)/100;
const firstCatalogue=p=>p.catalogue.find(c=>!c.variant_id)||p.catalogue[0]||null;
const languages=p=>{
 const entries=Object.values(p.details?.sourceData||{}).filter(Array.isArray).flat();
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
 const data=createCentralStoreData({rpc,actor}),catalogues=new Map();let choices=[],contextOwner=null;
 async function context(){const owner=actor();if(owner!==contextOwner){choices=[];catalogues.clear();contextOwner=null;}const next=await data.stores();choices=next;contextOwner=owner;for(const key of catalogues.keys())if(!choices.some(s=>s.id===key))catalogues.delete(key);return {stores:clone(choices)};}
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
 async function read(store,resource,{id=null,search='',page=0,size=100}={}){
  ensure(store);if(!Number.isSafeInteger(page)||page<0||!Number.isInteger(size)||size<1||size>100||!Number.isSafeInteger(page*size))throw Error('Página no válida.');
  let rows;
  if(resource==='products')rows=id?[centralProductRecord(await product(store,id))]:(await catalogue(store)).map(centralProductRecord);
  else if(['manufacturers','suppliers'].includes(resource))rows=(await directory(store,resource==='manufacturers'?'brands':'suppliers')).map(row=>({...row,active:'1'}));
  else if(resource==='combinations')rows=(await catalogue(store)).flatMap(p=>p.variants.map(v=>{const c=p.catalogue.find(c=>c.variant_id===v.id);return {...v,__central:true,id_product:p.id,reference:v.sku||'',ean13:c?.ean||'',price:c?String(cents(c.price_cents)):'',__attributes:Object.entries(v.attributes||{}).map(([group,value])=>({group,value})),associations:{}};}));
  else if(resource==='stock_availables')rows=(await catalogue(store)).flatMap(p=>p.catalogue.map(c=>({id:c.id,id_product:p.id,id_product_attribute:c.variant_id||'0',id_shop:'0',quantity:c.stock})));
  else throw Error('El recurso necesita su adaptador de datos de Central: '+resource);
  if(id)rows=rows.filter(r=>r.id===id);
  if(search){const needle=search.toLocaleLowerCase('es');rows=rows.filter(r=>[r.name,r.reference,r.ean13].some(v=>String(v||'').toLocaleLowerCase('es').includes(needle)));}
  const start=page*size;return {rows:rows.slice(start,start+size),possibly_more:start+size<rows.length,total:rows.length};
 }
 function invalidate(store){if(store)catalogues.delete(store);else catalogues.clear();data.invalidate();}
 return {context,catalogue,product,directory,read,invalidate,get stores(){return clone(choices);}};
}
