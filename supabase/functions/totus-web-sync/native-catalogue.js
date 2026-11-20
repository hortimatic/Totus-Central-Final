import {safeEndpoint,connectionHeaders,boundedJson} from '../totus-connections/transport.js';
import {safeImportedRecord} from '../../../src/website-import-contract.js';
export function nativeQuotedCents(value){if(typeof value!=='string'||!/^\d{1,10}(?:\.\d{1,6})?$/.test(value))throw Error('La API no ha devuelto un importe redondeado válido.');const [whole,fraction='']=value.split('.');if(/[1-9]/.test(fraction.slice(2)))throw Error('La API no ha aplicado el redondeo solicitado.');return Number(BigInt(whole)*100n+BigInt(fraction.slice(0,2).padEnd(2,'0')));}
async function getPage(url,connection,{request,resolve}){
 const target=await safeEndpoint(url.href,resolve);let response;
 for(let attempt=0;attempt<2;attempt++){try{response=await request(target.href,{method:'GET',headers:connectionHeaders(connection),redirect:'error',credentials:'omit',signal:AbortSignal.timeout(25000)});break;}catch{if(attempt===1)throw Error('La web ha interrumpido la lectura. Los lotes confirmados están guardados; puedes continuar.');}}
 if(!response.ok){await response.body?.cancel();throw Error('No se pudo leer el lote de precios oficiales (HTTP '+response.status+'). Los lotes guardados se conservan.');}
 if(/text\/html|application\/xhtml/i.test(response.headers.get('content-type')||'')){await response.body?.cancel();throw Error('La web devolvió una página en lugar de los precios.');}
 return safeImportedRecord(await boundedJson(response,6291456));
}
async function officialPriceBatch(connection,scope,options){
 const job=scope.job,context=scope.pricing,targets=scope.targets;
 if(!Array.isArray(targets)||targets.length>25)throw Error('Lote nativo no válido.');if(!targets.length)return null;
 if(!context||!['countryId','groupId','currencyId'].every(k=>Number.isSafeInteger(context[k])&&context[k]>0)||!Number.isSafeInteger(context.stateId)||context.stateId<0||typeof context.postcode!=='string'||!/^[A-Za-z0-9 -]{0,12}$/.test(context.postcode))throw Error('Falta el contexto fiscal importado del cliente de mostrador.');
 if(targets.some(t=>!Number.isSafeInteger(t.id)||t.id<1||!Number.isSafeInteger(t.productId)||t.productId<1||!Number.isSafeInteger(t.attributeId)||t.attributeId<0))throw Error('El lote contiene una identidad no válida.');
 const resource=job.phase==='variants'?'combinations':'products',url=new URL(connection.endpoint.replace(/\/$/,'')+'/'+resource);
 url.searchParams.set('output_format','JSON');url.searchParams.set('id_shop',String(job.shop_id));url.searchParams.set('display',resource==='combinations'?'[id,id_product,totus_incl,totus_excl,totus_rounded]':'[id,totus_incl,totus_excl,totus_rounded]');url.searchParams.set('filter[id]','['+targets.map(t=>t.id).join('|')+']');url.searchParams.set('sort','[id_ASC]');url.searchParams.set('limit','0,25');
 for(const [suffix,tax]of [['incl',1],['excl',0],['rounded',1]]){const fields={country:context.countryId,state:context.stateId,county:context.postcode,currency:context.currencyId,group:context.groupId,quantity:1,product_attribute:0,decimals:suffix==='rounded'?2:6,use_tax:tax,use_reduction:1,only_reduction:0,use_ecotax:1};for(const[key,value]of Object.entries(fields))url.searchParams.set('price[totus_'+suffix+']['+key+']',String(value));}
 const body=await getPage(url,connection,options),rows=body?.[resource];if(!Array.isArray(rows)||rows.length!==targets.length||new Set(rows.map(r=>Number(r.id))).size!==targets.length)throw Error('La API no ha devuelto todas las identidades solicitadas. No se ha confirmado este lote.');
 const priceText=value=>typeof value==='string'?value:typeof value==='number'&&Number.isFinite(value)?String(value):'';
 const items=targets.map(t=>{const row=rows.find(r=>Number(r.id)===t.id);if(!row||resource==='combinations'&&Number(row.id_product)!==t.productId)throw Error('La API ha devuelto una combinación de otro producto.');const incl=priceText(row.totus_incl),excl=priceText(row.totus_excl),rounded=priceText(row.totus_rounded);if(!/^\d{1,10}(?:\.\d{1,6})?$/.test(incl)||!/^\d{1,10}(?:\.\d{1,6})?$/.test(excl))throw Error('La API no ha devuelto sus precios calculados.');return {id:t.productId+':'+t.attributeId,product_id:t.productId,attribute_id:t.attributeId,name:t.product.name,reference:t.variant.reference??t.product.reference??'',ean:t.variant.ean13??'',stock:Number(t.stock),enabled_for_sale:String(t.product.active)==='1'&&String(t.product.available_for_order)==='1',choose_variant:false,unit_tax_incl:incl,unit_tax_excl:excl,preview_cents:nativeQuotedCents(rounded),source:'official-price-fields'};});
 return {items,page:job.page,has_more:false,currency:job.profile.currency,pricing_context:{...context,roundingSource:'official-price-decimals-2'}};
}
export async function readNativeCatalogueBatch(connection,scope,{request=fetch,resolve}={}){
 const job=scope.job,profile=job.phase==='profile';
 if(!['profile','products','variants','remaining'].includes(job.phase)||!Number.isSafeInteger(job.shop_id)||job.shop_id<1)throw Error('Preparación nativa no válida.');
 if(['variants','remaining'].includes(job.phase)&&scope.productId===null)return null;
 if(['variants','remaining'].includes(job.phase))return officialPriceBatch(connection,scope,{request,resolve});
 const url=new URL(connection.endpoint.replace(/\/$/,'')+'/'+(profile?'totus_tpv_profile':'totus_tpv_catalogue'));
 url.searchParams.set('output_format','JSON');url.searchParams.set('id_shop',String(job.shop_id));
 if(!profile){url.searchParams.set('page',String(job.page));url.searchParams.set('page_size','50');url.searchParams.set('sort_field','id');url.searchParams.set('sort_direction','asc');url.searchParams.set('inventory_only','1');if(job.phase==='variants')url.searchParams.set('product_id',String(scope.productId));}
 const body=await getPage(url,connection,{request,resolve});
 if(!body||typeof body!=='object'||Array.isArray(body))throw Error('Respuesta nativa no válida.');
 if(profile){if(body.verified!==true||body.shop_id!==job.shop_id||typeof body.currency!=='string'||!Number.isSafeInteger(body.language_id))throw Error('El perfil nativo no coincide con la tienda seleccionada.');}
 else if(!Array.isArray(body.items)||body.items.length>50||typeof body.has_more!=='boolean'||body.page!==job.page||body.currency!==job.profile.currency||body.items.some(item=>!Number.isSafeInteger(item.product_id)||item.product_id<1||!Number.isSafeInteger(item.attribute_id)||item.attribute_id<0||!Number.isSafeInteger(item.preview_cents)||item.preview_cents<0||typeof item.unit_tax_incl!=='string'||typeof item.unit_tax_excl!=='string'||job.phase==='variants'&&item.product_id!==scope.productId))throw Error('La página nativa no coincide con el recorrido solicitado.');
 return body;
}
