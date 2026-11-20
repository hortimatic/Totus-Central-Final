/** Password proof is sent only to the owning Supabase RPC, never persisted. */
export function createLocalPriceProof({url,key,actorId,currentActor,fetchImpl=globalThis.fetch}){
 const origin=new URL(url);if(origin.protocol!=='https:'||origin.pathname!=='/'||origin.search||origin.hash||origin.username||origin.password||typeof key!=='string'||!key||typeof currentActor!=='function')throw Error('No se ha podido preparar la confirmación de Central.');
 return async function approvePrice({quoteId,proofJwt}){
  const current=()=>currentActor()===actorId;
  try{
   if(!current()||typeof quoteId!=='string'||!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(quoteId)||typeof proofJwt!=='string'||proofJwt.length<10||proofJwt.length>16384)throw Error('Vuelve a confirmar tu cuenta desde esta venta.');
   const response=await fetchImpl(origin.origin+'/rest/v1/rpc/totus_tpv_local_price_approval',{method:'POST',headers:{apikey:key,Authorization:'Bearer '+proofJwt,'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({p_quote:quoteId}),credentials:'omit',cache:'no-store',redirect:'error'});
   if(!current())throw Error('La cuenta ha cambiado. Conserva el ticket.');
   const value=await response.json();if(!response.ok||value?.quoteId!==quoteId||value.approved!==true)throw Error('No se ha confirmado tu identidad para esta venta. Vuelve a intentarlo.');
   return {quoteId,approved:true};
  }finally{proofJwt='';}
 };
}
