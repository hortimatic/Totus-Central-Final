import {safeEndpoint,connectionHeaders,boundedJson} from '../totus-connections/transport.js';
import {validateWebsiteLanguageContext} from '../../../src/website-localization.js';
export async function readWebsiteLanguageContext(connection,{request=fetch,resolve}={}){
 const languages=[];let cursor=0;
 for(;;){
  const url=new URL(connection.endpoint.replace(/\/$/,'')+'/languages');url.searchParams.set('output_format','JSON');url.searchParams.set('display','full');url.searchParams.set('sort','[id_ASC]');url.searchParams.set('limit','0,100');if(cursor)url.searchParams.set('filter[id]','>['+cursor+']');
  const target=await safeEndpoint(url.href,resolve),response=await request(target.href,{method:'GET',headers:connectionHeaders(connection),redirect:'error',credentials:'omit',signal:AbortSignal.timeout(25000)});
  if(!response.ok){await response.body?.cancel();throw Error('No se pudo comprobar el inventario de idiomas.');}
  const body=await boundedJson(response,1048576),rows=body?.languages;if(!Array.isArray(rows)||rows.length>100)throw Error('La web no devolvió un inventario completo de idiomas.');
  for(const row of rows){const id=Number(row.id);if(!Number.isSafeInteger(id)||id<=cursor)throw Error('La lectura de idiomas no avanzó.');cursor=id;languages.push({id:String(id),name:row.name,isoCode:row.iso_code,active:String(row.active)==='1'});}
  if(rows.length<100)break;
 }
 let primaryLanguageId,source='connector-profile';
 const profileUrl=await safeEndpoint(connection.endpoint.replace(/\/$/,'')+'/totus_tpv_profile?output_format=JSON',resolve);
 const profileResponse=await request(profileUrl.href,{method:'GET',headers:connectionHeaders(connection),redirect:'error',credentials:'omit',signal:AbortSignal.timeout(25000)});
 if(profileResponse.ok){const profile=await boundedJson(profileResponse,1048576);if(profile.verified!==true||!Number.isSafeInteger(profile.language_id)||profile.language_id<1)throw Error('El conector no confirmó el idioma principal.');primaryLanguageId=String(profile.language_id);}
 else{await profileResponse.body?.cancel();const active=languages.filter(row=>row.active);if(![403,404,405].includes(profileResponse.status)||active.length!==1)throw Error('No se pudo comprobar el idioma principal. Revisa el recurso de perfil del conector.');primaryLanguageId=active[0].id;source='single-active-language';}
 return validateWebsiteLanguageContext({languages,primaryLanguageId,source});
}
