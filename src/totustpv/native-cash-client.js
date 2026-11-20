// Cajas reads the same native journals as the local TPV. No writes exist here.
export function createNativeCashClient({rpc,owner,currentActor}){
 return async request=>{
  const guard=()=>{if(!owner||currentActor()!==owner)throw Error('La cuenta ha cambiado. Vuelve a abrir Cajas.');};guard();
  if(!['central-cash-context','central-cash-read'].includes(request.action))throw Error('Consulta de caja no admitida.');
  const selection=request.selection||{};
  const result=await rpc('totus_tpv_local_cash_report',{p_section:request.action==='central-cash-context'?'context':request.section,p_selection:{...(selection.storeId?{storeId:selection.storeId}:{}),...(selection.drawerId?{drawerId:selection.drawerId}:{}),...(selection.sessionId?{sessionId:selection.sessionId}:{})},p_query:request.query||{}});
  guard();return result;
 };
}
