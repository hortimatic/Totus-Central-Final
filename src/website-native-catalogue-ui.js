import {sb} from './api.js?v=874c6938e6739ddf493afd7e1440d80388d46f15';
import {esc} from './utils.js?v=874c6938e6739ddf493afd7e1440d80388d46f15';
import {fieldHelp} from './components.js?v=874c6938e6739ddf493afd7e1440d80388d46f15';
export async function openNativeWebsiteCatalogue({rpc,website,name}){
 const dialog=document.createElement('dialog');dialog.className='api-user-dialog';
 let state=null,busy=false,stop=false,message='Consultando la preparación guardada…',requestId=crypto.randomUUID();
 const read=async()=>{state=await rpc('totus_web_native_catalogue',{p_website:website});};
 const action=async p_action=>{state=await rpc('totus_web_native_catalogue',{p_website:website,p_action,p_job:state.job.id});};
 const paint=()=>{const job=state?.job,pending=job&&['running','paused'].includes(job.state),stale=!!job&&state.sourceCurrent===false;dialog.innerHTML=`<header><h3>Precios y combinaciones · ${esc(name)}</h3></header><p>Guarda los precios calculados por la web y sus combinaciones para preparar el catálogo propio de Central.</p>${fieldHelp('Precios nativos','La lectura utiliza el contexto de moneda, cliente, dirección e impuestos del conector existente. Conserva los precios exactos y los céntimos devueltos por PrestaShop. No modifica productos, pedidos ni existencias en la web. Las descargas confirmadas se conservan aunque cierres el navegador.')}<label>Tienda de PrestaShop<select data-native-shop ${busy||pending?'disabled':''}>${(state?.shops||[]).map(s=>`<option value="${s.id}">${esc(s.name||'Tienda #'+s.id)}</option>`).join('')}</select></label>${job?`<section aria-label="Progreso del catálogo nativo"><h4>${stale?'Precios pendientes de actualizar':({running:'Preparación en curso',paused:'Preparación pausada',completed:'Lectura de precios nativos completada',cancelled:'Preparación cancelada'})[job.state]}</h4><p>${job.processed} lecturas confirmadas</p>${stale?`<p>Los datos importados han cambiado o esta lectura no tiene una versión de origen verificada. ${pending?'Cancela esta preparación y comienza una nueva.':'Vuelve a leer los precios antes de actualizar el catálogo.'} El catálogo ya incorporado se conserva.</p>`:''}<p>${({profile:'Verificar el contexto de precios',products:'Leer productos',variants:'Leer todas las combinaciones',remaining:'Leer productos restantes, incluidos inactivos y packs',completed:'Precios guardados en Central'})[job.phase]}</p></section>`:''}<p role="status">${esc(message)}</p><footer class="inline-actions">${pending?`<button type="button" class="btn primary" data-native-resume ${busy||stale?'disabled':''}>Continuar preparación</button><button type="button" class="btn secondary" data-native-pause ${!busy?'disabled':''}>Pausar</button><button type="button" class="btn danger" data-native-cancel ${busy?'disabled':''}>Cancelar preparación</button>`:`<button type="button" class="btn primary" data-native-start ${busy||!state?.shops?.length?'disabled':''}>Leer precios y combinaciones</button>`}<button type="button" class="btn secondary" data-native-close ${busy?'disabled':''}>Cerrar</button></footer>`;};
 const run=async task=>{if(busy)return;busy=true;message='';paint();try{await task();}catch(error){message=error.message||String(error);}finally{busy=false;if(dialog.isConnected)paint();}};
 async function process(){stop=false;if(state.job.state==='paused')await action('resume');while(dialog.isConnected&&!stop&&state.job.state==='running'){
  const response=await sb.functions.invoke('totus-web-sync',{body:{website,job:state.job.id,mode:'catalogue'}});
  if(response.error||response.data?.error){let detail;try{detail=await response.error?.context?.json();}catch{}throw Error(response.data?.error||detail?.error||response.error?.message||'No se pudo leer el lote. Puedes continuar desde lo confirmado.');}
  await read();if(dialog.isConnected)paint();
 }if(stop&&state.job.state==='running')await action('pause');}
 dialog.onclick=e=>{const button=e.target.closest('button');if(!button)return;
  if(button.hasAttribute('data-native-start')){const shop=Number(dialog.querySelector('[data-native-shop]').value);void run(async()=>{state=await rpc('totus_web_native_catalogue',{p_website:website,p_action:'start',p_job:requestId,p_shop:shop});requestId=crypto.randomUUID();await process();});}
  else if(button.hasAttribute('data-native-resume'))void run(process);
  else if(button.hasAttribute('data-native-pause')){stop=true;message='Terminando el lote actual…';paint();}
  else if(button.hasAttribute('data-native-cancel'))void run(async()=>{await action('cancel');message='Preparación detenida. Los precios guardados se conservan.';});
  else if(button.hasAttribute('data-native-close')){dialog.close();dialog.remove();}
 };
 dialog.oncancel=e=>{if(busy){e.preventDefault();stop=true;}else dialog.remove();};
 document.body.append(dialog);dialog.showModal();paint();try{await read();message='';}catch(error){message=error.message||String(error);}paint();return dialog;
}
