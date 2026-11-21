// The browser wakes the server processor; it never reads queue payloads,
// credentials, or acknowledges completion itself.
export function createCentralProductSyncClient({invoke,actor,current,canEdit,onNotice=()=>{},online=()=>navigator.onLine!==false}){
 const running=new Map();let generation=0;
 function run(store){
  if(running.has(store))return running.get(store);
  const owner=actor(),version=generation;
  const valid=()=>owner&&actor()===owner&&current()&&canEdit()&&generation===version;
  if(!valid()||!online())return Promise.resolve({status:'offline',processed:0});
  const task=(async()=>{
   let count=0;
   try{while(valid()&&online()){
    const response=await invoke({action:'central_product_sync',store_id:store});
    if(!valid())return {status:'stale',processed:count};
    if(response?.ok!==true||response.storeId!==store||![0,1].includes(response.processed))throw Error('Respuesta de sincronización no válida.');
    if(response.processed===0){if(count)onNotice({store,status:'completed',processed:count,message:count+' cambios comprobados en la web.'});return {status:'idle',processed:count};}
    count++;const item=response.item;if(!item||item.storeId!==store||!['completed','conflict','needs_configuration','uncertain','pending'].includes(item.status))throw Error('Resultado de otra tienda.');
    if(item.status!=='completed'){onNotice({store,status:item.status,processed:count,message:item.notice||'Hay cambios pendientes de comprobar.'});return {status:item.status,processed:count};}
   }return {status:'offline',processed:count};
   }catch{if(valid())onNotice({store,status:'uncertain',processed:count,message:'Los cambios siguen guardados en Central. No se ha podido confirmar la sincronización web.'});return {status:'uncertain',processed:count};}
  })();
  running.set(store,task);const cleanup=()=>{if(running.get(store)===task)running.delete(store);};task.then(cleanup,cleanup);return task;
 }
 return {run,dispose(){generation++;running.clear();}};
}
