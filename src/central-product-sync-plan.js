import {centralProductChanges,centralProductEditPayload,verifyCentralProductEdit} from './central-product-edit.js?v=7d7ef571fc64f1e11e44a308671ceb3fd39aed44';
import {centralProductRecord,centralCombinationRecord,centralDefaultCatalogue} from './central-product-adapter.js?v=7d7ef571fc64f1e11e44a308671ceb3fd39aed44';
import {LOCALIZED_PRODUCT_FIELDS} from './productos-write-contract.js?v=7d7ef571fc64f1e11e44a308671ceb3fd39aed44';
const numericId=value=>/^[1-9]\d{0,14}$/.test(String(value??''));
const localized=(value,language)=>{const rows=Array.isArray(value)?value:value?.language;return Array.isArray(rows)?rows.find(row=>String(row.id??row.language_id)===language)?.value:value;};
const decimalFields=new Set(['price','wholesale_price','weight','width','height','depth','additional_shipping_cost','minimal_quantity','low_stock_threshold','unit_price_ratio','ecotax']);
const normalizeDecimal=value=>{const text=String(value);if(!/^-?\d+(?:\.\d+)?$/.test(text))return text;const negative=text.startsWith('-'),[whole,fraction='']=text.replace(/^-/,'').split('.');const normalized=whole.replace(/^0+(?=\d)/,'')+(fraction.replace(/0+$/,'')?'.'+fraction.replace(/0+$/,''):'');return normalized==='0'?'0':(negative?'-':'')+normalized;};
export const equalCentralRemoteField=(field,a,b)=>a!==undefined&&b!==undefined&&(decimalFields.has(field)?normalizeDecimal(a)===normalizeDecimal(b):String(a)===String(b));
const micros=value=>{if(!/^-?\d+(?:\.\d{1,6})?$/.test(String(value)))throw Error('Precio remoto no verificable.');const negative=String(value).startsWith('-'),[whole,fraction='']=String(value).replace(/^-/,'').split('.');return (BigInt(whole)*1000000n+BigInt(fraction.padEnd(6,'0')))*(negative?-1n:1n);};
const format=value=>(value<0n?'-':'')+String((value<0n?-value:value)/1000000n)+'.'+String((value<0n?-value:value)%1000000n).padStart(6,'0');
const net=item=>{const denominator=10000n+BigInt(item.tax_basis_points);return (BigInt(item.price_cents)*100000000n+denominator/2n)/denominator;};
const gross=(value,item)=>{if(value<0n)throw Error('Precio final remoto negativo.');return Number((value*(10000n+BigInt(item.tax_basis_points))+50000000n)/100000000n);};
async function alignRemotePrice(job,plan,invoke){
 const change=plan.changes.find(row=>row.field==='price');if(!change)return;
 const before=job.before_snapshot,base=centralDefaultCatalogue(before);
 if(!base)throw Error('Falta el precio anterior del catálogo.');
 const read=async(resource,id)=>{const response=await invoke('prestashop_item_read',{resource,record_id:String(id)});if(response?.resource!==resource||String(response.record_id)!==String(id)||String(response.item?.id)!==String(id))throw Error('La lectura de precio pertenece a otro registro.');return response.item;};
 const parent=await read('products',before.source_id),remoteBase=micros(parent.price);
 let previous,desired,expected;
 if(plan.resource==='products'){
  let impact=0n;
  if(before.variants.length){
   const originalDefault=before.details?.nativePrice?.attribute_id??before.details?.sourceData?.cache_default_attribute??before.details?.sourceData?.id_default_combination;
   const selected=before.variants.find(row=>row.id===before.details?.defaultVariantId)||before.variants.find(row=>String(row.source_id)===String(originalDefault));
   if(!selected||base.variant_id!==selected.id||selected.source_website!==job.website_key||!numericId(selected.source_id))throw Error('Falta identificar la combinación predeterminada del precio.');
   const combination=await read('combinations',selected.source_id);if(String(combination.id_product)!==String(before.source_id))throw Error('La combinación de precio pertenece a otro producto.');impact=micros(combination.price);
  }
  previous=remoteBase+impact;desired=micros(change.value)-impact;expected=parent.price;
  if(desired<0n)throw Error('El nuevo precio requiere redistribuir los impactos de las combinaciones.');
 }else{
  const combination=await read('combinations',plan.record_id);if(String(combination.id_product)!==String(before.source_id))throw Error('La combinación de precio pertenece a otro producto.');
  const variant=before.variants.find(row=>row.id===job.changes.recordId),item=before.catalogue.find(row=>row.variant_id===variant?.id);
  if(!item)throw Error('Falta el precio anterior de la combinación.');
  previous=remoteBase+micros(combination.price);desired=net(base)+micros(change.value)-remoteBase;expected=combination.price;
  const desiredItem=job.desired_snapshot.catalogue.find(row=>row.variant_id===variant.id);
  if(gross(previous,item)!==item.price_cents&&(!desiredItem||gross(previous,desiredItem)!==desiredItem.price_cents))throw Error('La web ha cambiado el precio de la combinación.');
 }
 const desiredBase=centralDefaultCatalogue(job.desired_snapshot);
 if(plan.resource==='products'&&gross(previous,base)!==base.price_cents&&(!desiredBase||gross(previous,desiredBase)!==desiredBase.price_cents))throw Error('La web ha cambiado el precio del producto.');
 change.value=format(desired);plan.expected.find(row=>row.field==='price').before=String(expected);plan.expected.find(row=>row.field==='price').value=change.value;
}

// Identity and intent come from the saved queue, never from a guessed product
// reference or a selected browser row. A local copy has no remote identity.
export function centralProductSyncPlan(job){
 const before=job.before_snapshot,desired=job.desired_snapshot,intent=job.changes;
 if(!desired||desired.id!==job.product_id||desired.store_id!==job.store_id)throw Error('La solicitud no pertenece al producto de esta tienda.');
 if(!numericId(desired.source_id)||desired.source_website!==job.website_key)return {kind:'create',product:desired,website:job.website_key};
 if(!before||before.id!==desired.id||before.store_id!==desired.store_id||before.source_id!==desired.source_id||before.source_website!==desired.source_website)throw Error('El vínculo de la web ha cambiado desde el guardado.');
 if(!intent||Array.isArray(intent)||!['products','combinations'].includes(intent.resource))throw Error('Esta solicitud necesita reconstruir su revisión de campos antes de enviarse.');
 const {changes,variant}=centralProductChanges(before,intent.resource,intent.recordId,intent.changes);
 const built=centralProductEditPayload(before,intent.resource,intent.recordId,changes);
 verifyCentralProductEdit(desired,built.payload,intent.resource,intent.recordId,changes);
 const target=intent.resource==='products'?before:variant;
 if(!numericId(target.source_id)||target.source_website!==job.website_key)throw Error('El registro no tiene un vínculo inequívoco con esta web.');
 const record=intent.resource==='products'?centralProductRecord(before):centralCombinationRecord(before,variant,{...(job.source_combinations?.[variant.id]||{}),...(before.details?.copyVariantMetadata?.[variant.id]||{})});
 const expected=changes.map(change=>{
  const value=LOCALIZED_PRODUCT_FIELDS.includes(change.field)&&intent.resource==='products'?localized(record.__localized?.[change.field]??record[change.field],change.language_id):record[change.field];
  if(value===undefined||value===null)throw Error('Falta el valor anterior de '+change.field+'; no se sobrescribirá la web a ciegas.');
  return {...change,before:String(value)};
 });
 return {kind:'update',website:job.website_key,resource:intent.resource,record_id:String(target.source_id),...(intent.resource==='combinations'?{expected_product_id:String(before.source_id)}:{}),changes,expected};
}

// Uses the established authenticated prepare/commit transport and its durable
// request journal. Conflicts stay visible; a retry retains external_request.
export async function processCentralProductSync(job,{invoke,finish}){
 let plan;
 try{plan=centralProductSyncPlan(job);}catch(error){return finish('needs_configuration',error.message);}
 if(plan.kind==='create')return finish('needs_configuration','El alta requiere completar el recorrido de creación de producto, imágenes y combinaciones.');
 try{await alignRemotePrice(job,plan,invoke);}catch(error){return finish('conflict',error.message);}
 const args={resource:plan.resource,record_id:plan.record_id,...(plan.expected_product_id?{expected_product_id:plan.expected_product_id}:{}),changes:plan.changes};
 try{
  const preview=await invoke('prestashop_product_prepare',args);
  if(preview?.persisted!==false||preview.resource!==plan.resource||String(preview.record_id)!==plan.record_id||!Array.isArray(preview.changes)||preview.changes.length!==plan.expected.length)throw Error('La revisión de la web no corresponde a la solicitud guardada.');
  for(const expected of plan.expected){const actual=preview.changes.find(row=>row.field===expected.field&&String(row.language_id||'')===String(expected.language_id||''));
   if(!actual)throw Error('La revisión de la web está incompleta.');
   if(!equalCentralRemoteField(expected.field,actual.before,expected.before)&&!equalCentralRemoteField(expected.field,actual.before,expected.value))return finish('conflict','La web cambió '+expected.field+' desde la última copia. Revisa ambas versiones.');
  }
  if(preview.changes.every(row=>row.changed===false))return finish('completed','La web ya contiene exactamente los cambios guardados.',{verified:true,unchanged:true});
  if(preview.can_commit!==true)return finish('needs_configuration','La conexión permite consultar, pero aún no permite guardar productos.');
  const result=await invoke('prestashop_product_commit',{...args,request_id:job.external_request,expected_fingerprint:preview.fingerprint,confirmed:true,recover_unchanged:true});
  if(result?.resource!==plan.resource||String(result.record_id)!==plan.record_id||!(result.persisted===true&&result.verified===true||result.unchanged===true))throw Error('El envío no tiene una relectura confirmada.');
  return finish('completed','Cambios guardados y comprobados en la web.',{verified:true,recordId:plan.record_id});
 }catch{return finish('uncertain','No se ha podido confirmar el envío. Se conserva la misma solicitud para comprobarla sin duplicarla.');}
}
