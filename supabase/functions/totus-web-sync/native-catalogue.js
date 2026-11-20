import {safeEndpoint,connectionHeaders,boundedJson} from '../totus-connections/transport.js';
import {safeImportedRecord} from '../../../src/website-import-contract.js';
export async function readNativeCatalogueBatch(connection,scope,{request=fetch,resolve}={}){
 const job=scope.job,profile=job.phase==='profile';
 if(!['profile','products','variants'].includes(job.phase)||!Number.isSafeInteger(job.shop_id)||job.shop_id<1)throw Error('Preparación nativa no válida.');
 if(job.phase==='variants'&&scope.productId===null)return null;
 const url=new URL(connection.endpoint.replace(/\/$/,'')+'/'+(profile?'totus_tpv_profile':'totus_tpv_catalogue'));
 url.searchParams.set('output_format','JSON');url.searchParams.set('id_shop',String(job.shop_id));
 if(!profile){url.searchParams.set('page',String(job.page));url.searchParams.set('page_size','50');url.searchParams.set('sort_field','id');url.searchParams.set('sort_direction','asc');url.searchParams.set('inventory_only','1');if(job.phase==='variants')url.searchParams.set('product_id',String(scope.productId));}
 const target=await safeEndpoint(url.href,resolve);
 const response=await request(target.href,{method:'GET',headers:connectionHeaders(connection),redirect:'error',credentials:'omit',signal:AbortSignal.timeout(25000)});
 if(!response.ok){await response.body?.cancel();throw Error('No se pudo leer el catálogo nativo (HTTP '+response.status+'). Comprueba los permisos del conector. Los precios guardados se conservan.');}
 if(/text\/html|application\/xhtml/i.test(response.headers.get('content-type')||'')){await response.body?.cancel();throw Error('La web devolvió una página en lugar del catálogo nativo.');}
 const body=safeImportedRecord(await boundedJson(response,6291456));
 if(!body||typeof body!=='object'||Array.isArray(body))throw Error('Respuesta nativa no válida.');
 if(profile){if(body.verified!==true||body.shop_id!==job.shop_id||typeof body.currency!=='string'||!Number.isSafeInteger(body.language_id))throw Error('El perfil nativo no coincide con la tienda seleccionada.');}
 else if(!Array.isArray(body.items)||body.items.length>50||typeof body.has_more!=='boolean'||body.page!==job.page||body.currency!==job.profile.currency||body.items.some(item=>!Number.isSafeInteger(item.product_id)||item.product_id<1||!Number.isSafeInteger(item.attribute_id)||item.attribute_id<0||!Number.isSafeInteger(item.preview_cents)||item.preview_cents<0||typeof item.unit_tax_incl!=='string'||typeof item.unit_tax_excl!=='string'||job.phase==='variants'&&item.product_id!==scope.productId))throw Error('La página nativa no coincide con el recorrido solicitado.');
 return body;
}
