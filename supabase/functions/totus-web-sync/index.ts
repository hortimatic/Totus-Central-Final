import {readWebsiteSourceBatch} from './source-reader.js';
import {websiteKey} from '../../../src/website-registry.js';
import {createClient} from 'npm:@supabase/supabase-js@2.118.0';
import {withApplicationCors} from '../../../src/application-cors.js';
import {WEBSITE_IMPORT_RESOURCES,importBatchRows} from '../../../src/website-import-contract.js';
import {boundedJson} from '../totus-connections/transport.js';
const headers={'Content-Type':'application/json','Cache-Control':'no-store','Access-Control-Allow-Headers':'authorization,apikey,x-client-info,content-type','Access-Control-Allow-Methods':'POST,OPTIONS'};
const result=(value:any)=>{if(value.error)throw Error(value.error.message);return value.data;};
export async function handle(req:Request,env=Deno.env,factory:any=createClient,request:any=fetch){
 const send=(body:any,status=200)=>new Response(JSON.stringify(body),{status,headers});
 if(req.method==='OPTIONS')return send({});if(req.method!=='POST')return send({error:'Método no permitido.'},405);
 let admin:any,call:any;
 try{
  const input=await boundedJson(req,4096);
  if(Object.keys(input).some(k=>!['website','job'].includes(k))||!websiteKey(input.website)||!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(input.job||''))throw Error('Selecciona una importación válida.');
  const url=env.get('SUPABASE_URL')||'',key=JSON.parse(env.get('SUPABASE_PUBLISHABLE_KEYS')||'{}').default||env.get('SUPABASE_ANON_KEY')||'',secret=JSON.parse(env.get('SUPABASE_SECRET_KEYS')||'{}').default||env.get('SUPABASE_SERVICE_ROLE_KEY')||'';
  const bearer=req.headers.get('authorization');if(!bearer?.startsWith('Bearer '))return send({error:'Inicia sesión.'},401);
  const auth=factory(url,key,{global:{headers:{Authorization:bearer}},auth:{persistSession:false,autoRefreshToken:false}});
  const user=result(await auth.auth.getUser(bearer.slice(7))).user;if(!user)return send({error:'Sesión no válida.'},401);
  const scope=()=>auth.rpc('totus_web_import',{p_website:input.website,p_action:'step_context',p_job:input.job});
  const context=result(await scope()),job=context.job;
  if(job.actor_id!==user.id)throw Error('Reanuda la importación con la cuenta que la inició.');
  const resource=job.resources[job.resource_index-1];if(!WEBSITE_IMPORT_RESOURCES.includes(resource))throw Error('Recurso no admitido.');
  admin=factory(url,secret,{auth:{persistSession:false,autoRefreshToken:false}});
  const connection=result(await admin.rpc('totus_api_server',{p_id:context.connectionId,p_revision:context.connectionRevision}));
  if(connection.protocol!=='prestashop'||new URL(connection.endpoint).origin!==context.origin)throw Error('El destino de la importación ha cambiado.');
  const pageSize=resource==='products'?25:100;call={p_id:context.connectionId,p_revision:context.connectionRevision,p_call:crypto.randomUUID()};result(await admin.rpc('totus_api_call',call));
  const rows=await readWebsiteSourceBatch(connection,{resource,cursor:job.cursor_id,pageSize},{request});
  result(await scope()); // Recheck current user permissions after the remote response.
  const commit=result(await admin.rpc('totus_web_import_commit',{p_job:input.job,p_actor:user.id,p_resource:resource,p_cursor:job.cursor_id,p_rows:rows,p_more:rows.length===pageSize}));
  result(await admin.rpc('totus_api_call',{...call,p_result:{ok:true,resource,rows_count:rows.length}}));call=null;
  return send({ok:true,...commit});
 }catch(error){if(admin&&call)try{await admin.rpc('totus_api_call',{...call,p_result:{ok:false}});}catch{}return send({error:error instanceof Error?error.message:'No se pudo completar el lote.'},400);}
}
if(import.meta.main)Deno.serve(withApplicationCors((request:Request)=>handle(request)));
