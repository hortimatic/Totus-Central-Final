import {processCentralProductSync} from '../../../src/central-product-sync-plan.js';
const check=response=>{if(response.error)throw Error(response.error.message||'No se pudo comprobar la sincronización.');return response.data;};

// Invoked only after this Edge function has authenticated the normal user.
// Queue selection is scoped SQL; acknowledgements use the server client only.
export async function synchronizeCentralProduct({store,actor,context,scoped,admin,dispatch}){
 const claim=check(await scoped.rpc('totus_central_product_sync_claim',{p_store:store}));
 if(!claim?.job)return {ok:true,storeId:store,processed:0,status:'idle'};
 const job=claim.job;
 if(job.store_id!==store||!job.lease_id||job.lease_actor!==actor)throw Error('El turno de sincronización pertenece a otra tienda o usuario.');
 const finish=async(status,notice,result={})=>check(await admin.rpc('totus_central_product_sync_finish',{p_job:job.id,p_lease:job.lease_id,p_actor:actor,p_status:status,p_notice:notice,p_result:result}));
 const website=context.websites?.find(row=>row.key===job.website_key&&row.business_id===store&&row.status==='active'&&row.origin===job.destination?.origin&&row.connection_id===job.destination?.connectionId);
 const connection=website&&context.connections?.find(row=>row.id===website.connection_id&&row.enabled&&row.configured&&row.real_data_authorized&&row.revision===row.verified_revision);
 let result;
 if(!connection)result=await finish('needs_configuration','Comprueba y autoriza la conexión de esta tienda antes de sincronizar.');
 else result=await processCentralProductSync(job,{finish,invoke:async(action,args)=>{
  const response=await dispatch({action,store:website.key,id:connection.id,revision:connection.revision,call_id:crypto.randomUUID(),...args},{website:website.key,origin:job.destination.origin,connectionId:connection.id});
  if(!response.ok||response.body?.ok!==true||response.body.store!==website.key)throw Error('La web no confirmó la operación.');
  return response.body;
 }});
 return {ok:true,storeId:store,processed:1,item:result};
}
