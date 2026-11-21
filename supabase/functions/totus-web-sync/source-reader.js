import {safeEndpoint,connectionHeaders,boundedJson} from '../totus-connections/transport.js';
import {importBatchRows} from '../../../src/website-import-contract.js';
import {localizedWebsiteResource,localizeWebsiteSourceRecord,validateWebsiteLanguageContext} from '../../../src/website-localization.js';
export async function readWebsiteSourceBatch(connection,{resource,cursor,pageSize,languageContext=null},{request=fetch,resolve}={}){
 const base=new URL(connection.endpoint.replace(/\/$/,'')+'/'+resource);
 base.searchParams.set('output_format','JSON');base.searchParams.set('display','full');base.searchParams.set('sort','[id_ASC]');base.searchParams.set('limit','0,'+pageSize);
 if(cursor)base.searchParams.set('filter[id]','>['+cursor+']');
 if(localizedWebsiteResource(resource)){validateWebsiteLanguageContext(languageContext);base.searchParams.set('language','['+languageContext.languages.map(row=>row.id).join('|')+']');}
 for(let size=pageSize;size>=1;size=Math.floor(size/2)){
  base.searchParams.set('limit','0,'+size);const target=await safeEndpoint(base.href,resolve);let response;
  for(let attempt=0;attempt<2;attempt++){
   try{response=await request(target.href,{method:'GET',headers:connectionHeaders(connection),redirect:'error',credentials:'omit',signal:AbortSignal.timeout(25000)});break;}
   catch{if(attempt===1)throw Error('La web ha interrumpido la conexión. Los lotes confirmados están guardados; puedes continuar desde el último.');}
  }
  if(!response.ok){await response.body?.cancel();throw Error('No se pudo importar '+resource+' (HTTP '+response.status+'). Los lotes guardados se conservan.');}
  if(/text\/html|application\/xhtml/i.test(response.headers.get('content-type')||'')){await response.body?.cancel();throw Error('La web devolvió una página en vez de los datos de '+resource+'. Revisa su API.');}
  let body;
  try{body=await boundedJson(response,6291456);}catch(error){if(size>1&&/supera el límite/i.test(error.message)){await response.body?.cancel().catch(()=>{});continue;}throw error;}
  const rows=importBatchRows(body,resource,String(cursor||0),size);
  return {rows:localizedWebsiteResource(resource)?rows.map(row=>localizeWebsiteSourceRecord(row,resource,languageContext)):rows,pageSize:size};
 }
 throw Error('El registro excede el tamaño permitido. No se ha marcado el recurso como completo.');
}
