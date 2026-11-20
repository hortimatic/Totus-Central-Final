import {safeEndpoint,connectionHeaders,boundedJson} from '../totus-connections/transport.js';
import {importBatchRows} from '../../../src/website-import-contract.js';
export async function readWebsiteSourceBatch(connection,{resource,cursor,pageSize},{request=fetch,resolve}={}){
 const base=new URL(connection.endpoint.replace(/\/$/,'')+'/'+resource);
 base.searchParams.set('output_format','JSON');base.searchParams.set('display','full');base.searchParams.set('sort','[id_ASC]');base.searchParams.set('limit','0,'+pageSize);
 if(cursor)base.searchParams.set('filter[id]','>['+cursor+']');
 const target=await safeEndpoint(base.href,resolve);
 let response;
 for(let attempt=0;attempt<2;attempt++){
  try{response=await request(target.href,{method:'GET',headers:connectionHeaders(connection),redirect:'error',credentials:'omit',signal:AbortSignal.timeout(25000)});break;}
  catch{if(attempt===1)throw Error('La web ha interrumpido la conexión. Los lotes confirmados están guardados; puedes continuar desde el último.');}
 }
 if(!response.ok){await response.body?.cancel();throw Error('No se pudo importar '+resource+' (HTTP '+response.status+'). Los lotes guardados se conservan.');}
 if(/text\/html|application\/xhtml/i.test(response.headers.get('content-type')||'')){await response.body?.cancel();throw Error('La web devolvió una página en vez de los datos de '+resource+'. Revisa su API.');}
 return importBatchRows(await boundedJson(response,6291456),resource,String(cursor||0),pageSize);
}
