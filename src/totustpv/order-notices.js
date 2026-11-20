const need=(ok,message='Revisa los avisos e impresión de pedidos.')=>{if(!ok)throw Error(message);};
export const ORDER_NOTICE_DEFAULTS=Object.freeze({enabled:false,autoPrint:false});
export function orderNoticeOptions(value=ORDER_NOTICE_DEFAULTS){
 need(value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).length===2&&typeof value.enabled==='boolean'&&typeof value.autoPrint==='boolean');
 need(Object.keys(value).every(key=>Object.hasOwn(ORDER_NOTICE_DEFAULTS,key)));need(value.enabled||!value.autoPrint,'Activa los avisos antes de activar la impresión automática.');
 return {enabled:value.enabled,autoPrint:value.autoPrint};
}
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function orderNoticeFields(value,{disabled=false}={}){
 const v={enabled:value?.enabled===true,autoPrint:value?.autoPrint===true},off=disabled?'disabled':'';
 const field=(name,label,info)=>'<div class="tpv-general-field"><label class="tpv-check"><input type="checkbox" name="'+name+'" '+(v[name]?'checked':'')+' '+off+'>'+label+'</label><details class="tpv-info-help"><summary aria-label="Ayuda: '+label+'">i</summary><div role="note">'+info+'</div></details></div>';
 return '<fieldset '+off+'><legend>Pedidos nuevos de esta tienda</legend>'+field('enabled','Avisar de pedidos nuevos','Comprueba los pedidos de esta tienda mientras el puesto está abierto. Las ventas de este TPV se excluyen. Al activarlo toma el estado actual como punto de partida, sin imprimir el historial.')+field('autoPrint','Solicitar su impresión automáticamente','Utiliza la presentación del ticket de esta caja. El navegador puede pedir confirmar la impresora; no se puede verificar desde aquí que el papel haya salido. Los trabajos dudosos quedan para revisión y no se repiten automáticamente.')+'</fieldset>';
}
export const orderNoticeFromForm=form=>{const values=new FormData(form);return orderNoticeOptions({enabled:values.get('enabled')==='on',autoPrint:values.get('autoPrint')==='on'});};
export function orderNoticePolicy(value,drawerId){
 need(value?.drawerId===drawerId&&Number.isSafeInteger(value.revision)&&value.revision>=0,'No se han verificado los avisos de esta caja.');
 return {...value,settings:orderNoticeOptions(value.settings)};
}
export function orderNoticeInbox(snapshot){
 const rows=snapshot.jobs||[];
 return '<section class="card card-pad tpv-records"><header><h3>Pedidos nuevos · esta caja</h3><button type="button" class="btn secondary" data-tpv-order-notice="refresh">Comprobar ahora</button></header><p class="small muted">Las solicitudes de impresión no registran cobros ni confirman la salida del papel. Una reimpresión manual puede producir una copia adicional.</p>'+(snapshot.message?'<p role="status">'+esc(snapshot.message)+'</p>':'')+'<div class="tpv-history">'+rows.map(row=>'<article><div><b>'+esc(row.reference)+'</b><small>Pedido #'+row.orderId+' · '+esc(({pending:'Pendiente de imprimir',dispatching:'Enviando a impresión',requested:'Impresión solicitada',uncertain:'Revisar antes de reimprimir'})[row.status])+'</small></div><button type="button" class="btn secondary" data-tpv-order-notice="view" data-order-id="'+row.orderId+'">Ver ticket</button><button type="button" class="btn secondary" data-tpv-order-notice="print" data-order-id="'+row.orderId+'" '+(snapshot.busy?'disabled':'')+'>'+(row.status==='pending'?'Imprimir':'Reimprimir copia')+'</button></article>').join('')+'</div>'+(rows.length?'':'<p>No hay pedidos nuevos desde que activaste estos avisos.</p>')+'</section>';
}
const states=new Set(['pending','dispatching','requested','uncertain']);
const orderRows=rows=>{
 need(Array.isArray(rows)&&rows.length<=100,'No se ha podido verificar la lista de pedidos nuevos.');
 const ids=new Set();return rows.map(row=>{
  need(Number.isSafeInteger(row?.orderId)&&row.orderId>0&&!ids.has(row.orderId)&&typeof row.reference==='string'&&row.reference.trim()&&row.reference.length<=64,'La lista de pedidos no tiene identidades verificables.');
  ids.add(row.orderId);return {orderId:row.orderId,reference:row.reference};
 });
};
function readJournal(raw){
 if(!raw)return {version:1,baseline:false,high:0,jobs:[]};
 let value;try{value=JSON.parse(raw);}catch{throw Error('La cola guardada no se puede leer. Conserva este navegador y revisa los pedidos antes de reiniciar los avisos.');}
 need(value?.version===1&&typeof value.baseline==='boolean'&&Number.isSafeInteger(value.high)&&value.high>=0&&Array.isArray(value.jobs)&&value.jobs.length<=400,'La cola guardada no se puede verificar.');
 const ids=new Set();const jobs=value.jobs.map(row=>{
  need(Number.isSafeInteger(row?.orderId)&&row.orderId>0&&row.orderId<=value.high&&!ids.has(row.orderId)&&typeof row.reference==='string'&&row.reference.length<=64&&states.has(row.status),'La cola guardada no se puede verificar.');ids.add(row.orderId);
  return {orderId:row.orderId,reference:row.reference,status:row.status==='dispatching'?'uncertain':row.status};
 });
 return {version:1,baseline:value.baseline,high:value.high,jobs};
}
export function createOrderNoticeWatcher({scope,settings,current,storage,readOptions=null,readCheckpoint=null,readOrders,readOwnOrders,readReceipt,print,reservePrint=null,onChange=()=>{},withLock=null,setTimer=setTimeout,clearTimer=clearTimeout,intervalMs=120000}){
 let epoch=0,timer=null,active=false,busy=false,message='',jobs=[],lastKey='';
 const key=()=>{
  const v=scope();need(v&&['actorId','connectionId','drawerId'].every(k=>typeof v[k]==='string'&&v[k].length>0&&v[k].length<=80)&&Number.isSafeInteger(v.shopId)&&v.shopId>0,'Selecciona un puesto para recibir avisos.');
  return 'totus-tpv-order-notices-v1:'+encodeURIComponent(JSON.stringify([v.actorId,v.connectionId,v.shopId,v.drawerId]));
 };
 const valid=(run,k)=>active&&run===epoch&&current()&&key()===k;
 const notify=()=>onChange();
 const locked=async(k,fn)=>{
  if(withLock)return withLock(k,fn);
  if(!globalThis.navigator?.locks?.request)throw Error('Este navegador no permite coordinar la impresión entre pestañas. Imprime desde el historial o utiliza un navegador compatible.');
  return navigator.locks.request(k,{ifAvailable:true},lock=>lock?fn():undefined);
 };
 const persist=(k,journal)=>{storage.setItem(k,JSON.stringify(journal));jobs=journal.jobs.map(row=>({...row}));};
 async function dispatch(journal,row,k,run,automatic=false){
  const document=await readReceipt(row.orderId);if(!valid(run,k))return;
  if(automatic&&readOptions){const latest=orderNoticeOptions(await readOptions());if(!valid(run,k)||!latest.enabled||!latest.autoPrint)return;}
  need(document?.external_order===true&&document.order_id===row.orderId,'El ticket no corresponde al pedido que vas a imprimir.');
  const attemptId=crypto.randomUUID();row.status='dispatching';persist(k,journal);notify();
  try{
  if(reservePrint){const reservation=await reservePrint({orderId:row.orderId,id:attemptId,action:'claim',manual:!automatic});if(!valid(run,k))return;need(reservation?.id===attemptId&&typeof reservation.allowed==='boolean'&&['claimed','requested','uncertain','busy','disabled'].includes(reservation.status),'No se ha podido verificar la reserva de impresión.');need(!reservation.allowed||reservation.status==='claimed','La reserva de impresión no está disponible.');if(!reservation.allowed){row.status=reservation.status==='requested'?'requested':reservation.status==='disabled'?'pending':'uncertain';message=reservation.status==='busy'?'Otro equipo está solicitando esta impresión. Revisa la cola antes de reimprimir.':reservation.status==='disabled'?'La impresión automática está desactivada.':'La solicitud anterior está registrada en Central.';persist(k,journal);notify();return;}}
   const result=await print(document,()=>valid(run,k));
   if(!valid(run,k))return;
   row.status=result?.requested===true?'requested':'uncertain';
   if(reservePrint){const saved=await reservePrint({orderId:row.orderId,id:attemptId,action:row.status,manual:!automatic});if(!valid(run,k))return;need(saved?.id===attemptId&&saved.status===row.status,'No se pudo confirmar en Central la solicitud. Revisa la cola antes de reimprimir.');}
   message=row.status==='requested'?'Solicitud de impresión enviada al navegador.':'Revisa la impresora antes de reimprimir este pedido.';
  }catch(error){if(!valid(run,k))return;row.status='uncertain';message=error.message||'No se pudo confirmar la solicitud de impresión.';if(reservePrint)try{await reservePrint({orderId:row.orderId,id:attemptId,action:'uncertain',manual:!automatic});}catch{}if(!valid(run,k))return;}
  if(valid(run,k)){persist(k,journal);notify();}
 }
 async function refresh(){
  if(!active||busy||!current())return;
  const run=epoch,k=key();
  busy=true;message='';notify();
  try{await locked(k,async()=>{
   if(!valid(run,k))return;const options=orderNoticeOptions(readOptions?await readOptions():settings());if(!valid(run,k)||!options.enabled)return;const journal=readJournal(storage.getItem(k));
   const [external,own]=await Promise.all([readOrders(),readOwnOrders()]);if(!valid(run,k))return;
   const rows=orderRows(external),ownRows=orderRows(own),physical=new Set(ownRows.map(row=>row.orderId)),high=Math.max(journal.high,0,...rows.map(row=>row.orderId));
   let sharedStates={};if(readCheckpoint){const checkpoint=await readCheckpoint(high,rows.map(row=>row.orderId));if(!valid(run,k))return;need(checkpoint&&Number.isSafeInteger(checkpoint.high)&&checkpoint.high>=0&&checkpoint.high<=high&&checkpoint.states&&typeof checkpoint.states==='object'&&!Array.isArray(checkpoint.states)&&Object.entries(checkpoint.states).every(([id,state])=>rows.some(row=>String(row.orderId)===id)&&['requested','uncertain'].includes(state)),'No se han podido verificar los avisos compartidos de esta caja.');sharedStates=checkpoint.states;if(!journal.baseline){journal.high=checkpoint.high;journal.baseline=true;}else journal.high=Math.max(journal.high,checkpoint.high);journal.jobs=journal.jobs.map(row=>sharedStates[row.orderId]?{...row,status:sharedStates[row.orderId]}:row);}
   if(!journal.baseline){journal.baseline=true;journal.high=high;message='Avisos preparados desde este momento. El historial anterior no se imprime.';}
   else{
    const newRows=rows.filter(row=>row.orderId>journal.high&&!physical.has(row.orderId)).sort((a,b)=>a.orderId-b.orderId);
    const pending=journal.jobs.filter(row=>row.status!=='requested');
    need(pending.length+newRows.filter(row=>sharedStates[row.orderId]!=='requested').length<=100,'Hay demasiados trabajos sin revisar. Revisa la cola antes de continuar; los pedidos nuevos no se han descartado.');
    if(rows.length===100&&!rows.some(row=>row.orderId<=journal.high))message='Puede haber más de cien pedidos desde la última comprobación. Revisa también el historial completo de la web.';
    journal.jobs=[...journal.jobs,...newRows.map(row=>({...row,status:sharedStates[row.orderId]||'pending'}))];
    const removable=journal.jobs.filter(row=>row.status==='requested').slice(0,Math.max(0,journal.jobs.length-400));
    journal.jobs=journal.jobs.filter(row=>!removable.includes(row));journal.high=high;
   }
   persist(k,journal);lastKey=k;
   if(options.autoPrint){for(const row of journal.jobs.filter(row=>row.status==='pending')){if(!valid(run,k))return;await dispatch(journal,row,k,run,true);if(row.status==='uncertain')break;}}
  });}catch(error){if(valid(run,k))message=error.message||'No se han podido comprobar los pedidos. Volveremos a intentarlo.';}
  finally{if(run===epoch){busy=false;notify();}}
 }
 async function requestPrint(orderId){
  if(!active||busy||!current())return;const run=epoch,k=key();busy=true;notify();
  try{await locked(k,async()=>{if(!valid(run,k))return;const journal=readJournal(storage.getItem(k)),row=journal.jobs.find(row=>row.orderId===orderId);need(row,'El pedido ya no está en la cola de esta caja.');await dispatch(journal,row,k,run);});}
  catch(error){if(valid(run,k))message=error.message||'No se pudo preparar la impresión.';}
  finally{if(run===epoch){busy=false;notify();}}
 }
 function schedule(run){timer=setTimer(async()=>{if(!active||run!==epoch)return;await refresh();if(active&&run===epoch)schedule(run);},Math.max(60000,intervalMs));}
 function stop(){epoch++;active=false;clearTimer(timer);timer=null;busy=false;message='';jobs=[];lastKey='';}
 return {stop,refresh,requestPrint,snapshot:()=>({busy,message,jobs:jobs.map(row=>({...row}))}),async start(){
  stop();active=true;const run=epoch;try{const k=key();lastKey=k;jobs=readJournal(storage.getItem(k)).jobs;const options=orderNoticeOptions(settings());if(options.enabled){await refresh();if(active&&run===epoch)schedule(run);}}catch(error){message=error.message;notify();}
 }};
}
