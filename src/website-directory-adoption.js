import {esc} from './utils.js?v=d8406c01d7a66ad480bcd1aabd80fa6cda456ce1';
import {fieldHelp} from './components.js?v=d8406c01d7a66ad480bcd1aabd80fa6cda456ce1';
const directories=[['manufacturers','Marcas','/marcas'],['suppliers','Proveedores','/proveedores'],['customers','Clientes','/clientes']];
export async function openWebsiteDirectories({rpc,website,name}){
 const dialog=document.createElement('dialog');dialog.className='api-user-dialog';
 let state=null,busy=false,stop=false,message='Consultando los datos guardados…';
 const read=async()=>{state=await rpc('totus_web_directory_projection',{p_website:website});};
 const paint=()=>{dialog.innerHTML=`<header><h3>Directorios de ${esc(name)}</h3></header><p>Incorpora los datos importados al establecimiento asignado para trabajar con ellos en Central.</p>${fieldHelp('Conservación y cambios','Se conservan todas las direcciones y los datos originales. Cada registro mantiene su identidad de origen. Repetir este paso no duplica registros. Si cambian a la vez en Central y en la web, se conserva Central y se señala el conflicto. Este paso no envía cambios a la web.')}<table><thead><tr><th>Directorio</th><th>Guardados</th><th>Incorporados</th><th>Conflictos</th><th>Abrir</th></tr></thead><tbody>${directories.map(([key,label,url])=>{const s=state?.resources?.[key];return `<tr><th>${label}</th><td>${s?.available??'—'}</td><td>${s?.incorporated??'—'}</td><td>${s?.conflicts??'—'}</td><td><a href="${url}" target="_blank" rel="noopener">${label}</a></td></tr>`;}).join('')}</tbody></table><p role="status">${esc(message)}</p><footer class="inline-actions"><button type="button" class="btn primary" data-adopt ${busy||!state?'disabled':''}>Incorporar o actualizar directorios</button>${busy?'<button type="button" class="btn secondary" data-stop>Pausar</button>':'<button type="button" class="btn secondary" data-close>Cerrar</button>'}</footer>`;};
 const close=()=>{if(busy){stop=true;return;}dialog.close();dialog.remove();};
 dialog.onclick=async e=>{
  if(e.target.closest('[data-close]'))return close();
  if(e.target.closest('[data-stop]')){stop=true;message='Terminando el lote actual…';paint();return;}
  if(!e.target.closest('[data-adopt]')||busy)return;
  busy=true;stop=false;let conflicts=0;
  try{
   for(const [resource,label] of directories){let cursor=0,more=true;while(more&&!stop){message=`Incorporando ${label.toLowerCase()}…`;paint();const result=await rpc('totus_web_directory_projection',{p_website:website,p_resource:resource,p_cursor:cursor,p_apply:true});if(result.more&&result.cursor<=cursor)throw Error('No se ha podido avanzar. Los datos confirmados se conservan.');cursor=result.cursor;more=result.more;conflicts+=result.conflicts||0;}}
   await read();message=stop?'Pausado. Puedes continuar sin duplicar los datos confirmados.':conflicts?'Directorios incorporados con conflictos pendientes. Se han conservado los cambios de Central.':'Directorios incorporados. Ya puedes abrir sus fichas desde Central.';
  }catch(error){message=(error.message||String(error))+' Los datos confirmados se conservan; puedes volver a continuar.';try{await read();}catch{}}
  finally{busy=false;if(dialog.isConnected)paint();}
 };
 dialog.oncancel=e=>{if(busy){e.preventDefault();stop=true;}else dialog.remove();};
 document.body.append(dialog);dialog.showModal();paint();
 try{await read();message='';}catch(error){message=error.message||String(error);}paint();return dialog;
}
