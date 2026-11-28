import {PRODUCT_WRITE_FIELDS,LOCALIZED_PRODUCT_FIELDS,validateProductFieldValue} from './productos-write-contract.js?v=7773867cd26a78076832f506420b829c4224fb9f';
import {centralDefaultCatalogue,centralProductRecord,centralCombinationRecord} from './central-product-adapter.js?v=7773867cd26a78076832f506420b829c4224fb9f';
import {savedWebsiteTranslations} from './website-localization.js?v=7773867cd26a78076832f506420b829c4224fb9f';

const clone=value=>structuredClone(value);
const uuid=value=>typeof value==='string'&&/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(value);
const aliases={meta_title:'metaTitle',meta_description:'metaDescription',meta_keywords:'metaKeywords',link_rewrite:'slug',description:'description',description_short:'descriptionShort'};
const translations=value=>Array.isArray(value)?value:Array.isArray(value?.language)?value.language:null;
const micros=value=>{if(!/^-?\d+(?:\.\d{1,6})?$/.test(String(value)))throw Error('El importe debe tener como máximo seis decimales.');const negative=String(value).startsWith('-'),parts=String(value).replace(/^-/,'').split('.');const result=BigInt(parts[0])*1000000n+BigInt((parts[1]||'').padEnd(6,'0'));return negative?-result:result;};
const net=c=>(BigInt(c.price_cents)*100000000n+(10000n+BigInt(c.tax_basis_points))/2n)/(10000n+BigInt(c.tax_basis_points));
const gross=(value,tax)=>{const cents=(value*(10000n+BigInt(tax))+50000000n)/100000000n;if(value<0n||cents<0n||cents>999999999n)throw Error('El precio final de una combinación no es válido.');return Number(cents);};
const primary=p=>String(p.details?.primaryLanguageId||p.details?.sourceData?.__i18n?.primaryLanguageId||translations(p.details?.sourceData?.name)?.[0]?.id||'1');
export function centralProductChanges(product,resource,id,changes){
 if(!['products','combinations'].includes(resource)||!uuid(product.id)||!uuid(product.store_id)||!uuid(id)||!Array.isArray(changes)||!changes.length||changes.length>100)throw Error('Revisión de producto no válida.');
 const variant=resource==='combinations'?product.variants.find(v=>v.id===id):null;
 if(resource==='products'?product.id!==id:!variant)throw Error('La ficha no pertenece al producto de esta tienda.');
 const seen=new Set(),languageIds=new Set([primary(product),...(centralProductRecord(product).__language_ids||[])]);
 const normalized=changes.map(row=>{
  if(!row||Object.keys(row).some(key=>!['field','value','language_id'].includes(key))||!PRODUCT_WRITE_FIELDS[resource].includes(row.field))throw Error('Campo de producto no admitido.');
  const localized=resource==='products'&&LOCALIZED_PRODUCT_FIELDS.includes(row.field),lang=localized?String(row.language_id||''):null;
  if(localized?!languageIds.has(lang):Object.hasOwn(row,'language_id'))throw Error('Selecciona un idioma de esta ficha.');
  const token=row.field+'|'+(lang||'');if(seen.has(token))throw Error('Campo o idioma repetido.');seen.add(token);
  return {field:row.field,value:validateProductFieldValue(row.field,row.value,resource),...(localized?{language_id:lang}:{})};
 });
 return {variant,changes:normalized};
}
// The mature Products editor keeps its existing prepare/commit controls. This
// maps their selected fields onto one complete native save with both product
// and catalogue revisions; unrelated variants, languages and metadata survive.
export function centralProductEditPayload(product,resource,id,requested){
 const {variant,changes}=centralProductChanges(product,resource,id,requested),base=centralDefaultCatalogue(product);
 if(!base)throw Error('El producto no tiene un precio de catálogo verificable.');
 const payload={...clone(product.details||{}),name:product.name,reference:product.sku||'',notes:product.notes||'',
  brandId:product.brand_id||'',supplierId:product.supplier_id||'',unit:base.quantity_unit||'unit',
  priceCents:base.price_cents,taxBasisPoints:base.tax_basis_points,stock:Number(base.stock),
  active:product.catalogue.some(c=>c.active),ean:product.variants.length?String(product.details?.ean??product.details?.sourceData?.ean13??''):base.ean||'',
  expectedRevision:product.updated_at,catalogueRevisions:Object.fromEntries(product.catalogue.map(c=>[c.id,c.revision])),
  variants:product.variants.map(v=>{const c=product.catalogue.find(c=>c.variant_id===v.id);if(!c)throw Error('Falta el precio o stock de una combinación.');return {id:v.id,reference:v.sku||'',attributes:clone(v.attributes),priceCents:c.price_cents,taxBasisPoints:c.tax_basis_points,stock:Number(c.stock),ean:c.ean||'',active:v.active!==false&&c.active!==false,...(v.cost_net==null?{}:{costNet:String(v.cost_net)})};})};
 payload.sourceData=clone(product.details?.sourceData||{});
 const primaryId=primary(product),review=[];
 let desiredBase=net(base);
 const beforeRecord=variant?centralCombinationRecord(product,variant,product.details?.copyVariantMetadata?.[variant.id]||{}):centralProductRecord(product);
 for(const change of changes){
  const {field,value}=change;
  let before=beforeRecord[field]??'';
  if(resource==='products'){
   if(LOCALIZED_PRODUCT_FIELDS.includes(field)){
   const values=clone(savedWebsiteTranslations(payload.sourceData,field))||[...new Set([primaryId,...languageIds(product)])].map(languageId=>({id:languageId,value:languageId===primaryId?(field==='name'?product.name:product.details?.[aliases[field]]??payload.sourceData[field]??''):''}));
    const index=values.findIndex(row=>String(row.id??row.language_id)===change.language_id);
    if(index<0)throw Error('Falta el idioma seleccionado en el contenido guardado.');
    before=values[index].value??'';values[index]={...values[index],value};payload.sourceData[field]=values;
    if(change.language_id===primaryId){if(field==='name')payload.name=value;else if(aliases[field])payload[aliases[field]]=value;}
   }else{
    payload.sourceData[field]=value;
    if(field==='reference')payload.reference=value;
    if(field==='ean13')payload.ean=value;
    if(field==='active'){payload.active=value==='1';for(const item of payload.variants)item.active=payload.active;}
    if(field==='price')desiredBase=micros(value);
   }
  }else{
   const item=payload.variants.find(v=>v.id===variant.id);
   payload.copyVariantMetadata??={};payload.copyVariantMetadata[variant.id]={...clone(payload.copyVariantMetadata[variant.id]||{}),[field]:value};
   if(field==='reference')item.reference=value;
   if(field==='ean13')item.ean=value;
   if(field==='wholesale_price')item.costNet=value;
   if(field==='price')item.priceCents=gross(net(base)+micros(value),item.taxBasisPoints);
  }
  review.push({...change,before,after:value,changed:String(before)!==value});
 }
 if(resource==='products'&&changes.some(row=>row.field==='price')){
  const delta=desiredBase-net(base);payload.priceCents=gross(desiredBase,base.tax_basis_points);
  for(const item of payload.variants){const original=product.catalogue.find(c=>c.variant_id===item.id);item.priceCents=gross(net(original)+delta,item.taxBasisPoints);}
 }
 if(variant){const changedDefault=payload.variants.find(v=>v.id===base.variant_id);if(changedDefault)payload.priceCents=changedDefault.priceCents;}
 return {payload,review,changes};
}
const languageIds=product=>(centralProductRecord(product).__language_ids||[]);

export function verifyCentralProductEdit(actual,payload,resource,id,changes){
 const base=centralDefaultCatalogue(actual),variant=actual.variants.find(v=>v.id===id),item=actual.catalogue.find(c=>c.variant_id===id);
 const fail=field=>{throw Error('El guardado está registrado, pero la relectura de '+field+' no coincide. No repitas la operación como un guardado nuevo.');};
 for(const {field,value,language_id}of changes){
  if(resource==='products'){
   if(LOCALIZED_PRODUCT_FIELDS.includes(field)){
    const saved=translations(actual.details?.sourceData?.[field])?.find(row=>String(row.id??row.language_id)===language_id)?.value;
    if(saved!==value)fail(field);
    if(field==='name'&&language_id===primary(actual)&&actual.name!==payload.name)fail(field);
   }else{
    if(actual.details?.sourceData?.[field]!==value)fail(field);
    if(field==='reference'&&actual.sku!==value)fail(field);
    if(field==='ean13'&&(actual.variants.length?actual.details?.ean:base?.ean)!==value)fail(field);
    if(field==='price'){
     if(base?.price_cents!==payload.priceCents)fail(field);
     for(const expected of payload.variants)if(actual.catalogue.find(c=>c.variant_id===expected.id)?.price_cents!==expected.priceCents)fail(field);
    }
    if(field==='active'&&actual.catalogue.some(c=>c.active!==payload.active))fail(field);
   }
  }else{
   if(!variant||!item||actual.details?.copyVariantMetadata?.[id]?.[field]!==value)fail(field);
   const expected=payload.variants.find(v=>v.id===id);
   if(field==='reference'&&variant.sku!==value)fail(field);
   if(field==='ean13'&&item.ean!==value)fail(field);
   if(field==='price'&&item.price_cents!==expected.priceCents)fail(field);
   if(field==='wholesale_price'&&(variant.cost_net==null||micros(String(variant.cost_net))!==micros(value)))fail(field);
  }
 }
 return true;
}
