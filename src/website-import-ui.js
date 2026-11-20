import {sb} from './api.js?v=749d5b8ffcdef600be8e1ed9e030448ab28d9158';
import {esc} from './utils.js?v=749d5b8ffcdef600be8e1ed9e030448ab28d9158';
import {fieldHelp} from './components.js?v=749d5b8ffcdef600be8e1ed9e030448ab28d9158';
import {WEBSITE_IMPORT_GROUPS} from './website-import-contract.js?v=749d5b8ffcdef600be8e1ed9e030448ab28d9158';
export async function openWebsiteImport({rpc,website,name,resources,current=()=>true}){
 const readable=new Set(resources.filter(r=>r.readable).map(r=>r.name));
 const dialog=document.createElement('dialog');dialog.className='api-user-dialog';
 let status=null,busy=false,stop=false,message='',requestId=crypto.randomUUID(),selection=WEBSITE_IMPORT_GROUPS.map(g=>g.key);
 const rpcArgs=action=>({p_website:website,p_action:action,p_job:status?.job?.id});
 const load=async()=>{status=await rpc('totus_web_import',{p_website:website,p_action:'status'});};
 const active=()=>dialog.isConnected&&current();
 const paint=()=>{
  const job=status?.job,pending=job&&['running','paused'].includes(job.state);
  dialog.innerHTML='<header><h3>Importar a Central · '+esc(name)+'</h3></header><p>Guarda en Central los registros accesibles de esta web. No modifica la web ni sustituye una copia de seguridad completa.</p>'+fieldHelp('Alcance de importación','Se conservan datos multidioma, SEO y relaciones disponibles en cada recurso. Las contraseñas y datos completos de tarjetas se excluyen. Las imágenes de producto conservan sus asociaciones; su descarga binaria y la integración operativa se verifican por separado.')+
   '<form data-import-form><fieldset '+(pending||busy?'disabled':'')+'><legend>Información que quieres conservar</legend>'+WEBSITE_IMPORT_GROUPS.map(g=>{const available=g.resources.filter(r=>readable.has(r)),missing=g.resources.filter(r=>!readable.has(r));return '<label class="check-field"><input type="checkbox" name="groups" value="'+g.key+'" '+(selection.includes(g.key)?'checked':'')+' '+(!available.length?'disabled':'')+'>'+esc(g.name)+' · '+available.length+' recursos disponibles</label>'+(missing.length?'<details><summary>Recursos no disponibles ('+missing.length+')</summary><p>'+missing.map(esc).join(', ')+'</p></details>':'');}).join('')+'</fieldset>'+(!pending?'<button class="btn primary" type="submit" '+(busy?'disabled':'')+'>Iniciar importación</button>':'')+'</form>'+
   (job?'<section aria-label="Progreso de importación"><h4>'+({running:'Importación en curso',paused:'Importación pausada',completed:'Lectura y guardado de recursos completados',cancelled:'Importación cancelada'})[job.state]+'</h4><p>'+job.imported+' registros procesados · '+Math.min(job.resource_index-1,job.resources.length)+' / '+job.resources.length+' recursos</p>'+Object.entries(job.progress||{}).map(([resource,n])=>'<p>'+esc(resource)+': '+n+'</p>').join('')+(pending?'<p>Recurso actual: '+esc(job.resources[job.resource_index-1]||'')+'</p>':'')+'</section>':'')+
   '<p role="status">'+esc(message)+'</p><footer class="inline-actions">'+(pending?'<button type="button" class="btn primary" data-import-resume '+(busy?'disabled':'')+'>Continuar importación</button><button type="button" class="btn secondary" data-import-pause '+(!busy?'disabled':'')+'>Pausar</button><button type="button" class="btn danger" data-import-cancel '+(busy?'disabled':'')+'>Cancelar importación</button>':'')+'<button type="button" class="btn secondary" data-import-close '+(busy?'disabled':'')+'>Cerrar</button></footer>';
 };
 const run=async task=>{if(busy)return;busy=true;message='';paint();try{await task();}catch(e){message=e.message||String(e);}finally{busy=false;if(active())paint();}};
 async function process(){
  stop=false;
  if(status.job.state==='paused')status=await rpc('totus_web_import',rpcArgs('resume'));
  while(active()&&!stop&&status.job?.state==='running'){
   const response=await sb.functions.invoke('totus-web-sync',{body:{website,job:status.job.id}});
   if(response.error||response.data?.error){let detail;try{detail=await response.error?.context?.json();}catch{}throw Error(response.data?.error||detail?.error||response.error?.message||'No se pudo guardar el lote. Puedes continuar sin repetir lo confirmado.');}
   await load();if(active())paint();
  }
  if(active()&&stop&&status.job?.state==='running')status=await rpc('totus_web_import',rpcArgs('pause'));
 }
 dialog.onsubmit=e=>{if(!e.target.matches('[data-import-form]'))return;e.preventDefault();selection=[...new FormData(e.target).getAll('groups')];const chosen=WEBSITE_IMPORT_GROUPS.filter(g=>selection.includes(g.key)).flatMap(g=>g.resources).filter(r=>readable.has(r));if(!chosen.length){message='Selecciona al menos un grupo con recursos disponibles.';paint();return;}void run(async()=>{status=await rpc('totus_web_import',{p_website:website,p_action:'start',p_job:requestId,p_resources:chosen});requestId=crypto.randomUUID();await process();});};
 dialog.onclick=e=>{const button=e.target.closest('button');if(!button)return;if(button.hasAttribute('data-import-pause')){stop=true;message='Terminando el lote actual para pausar sin perder datos.';paint();}else if(button.hasAttribute('data-import-resume'))void run(process);else if(button.hasAttribute('data-import-cancel'))void run(async()=>{status=await rpc('totus_web_import',rpcArgs('cancel'));message='Importación detenida. Los registros ya guardados se conservan.';});else if(button.hasAttribute('data-import-close')){dialog.close();dialog.remove();}};
 dialog.addEventListener('cancel',e=>{if(busy){e.preventDefault();stop=true;}else dialog.remove();});
 document.body.append(dialog);dialog.showModal();message='Consultando importaciones anteriores…';paint();try{await load();message='';if(active())paint();}catch(e){message=e.message;paint();}
 return dialog;
}
