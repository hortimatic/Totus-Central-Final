import {esc} from './utils.js?v=d64b6adcc46ee7e6db5cfdbf579903465eaf648d';
import {directoryText} from './contact-directory-core.js?v=d64b6adcc46ee7e6db5cfdbf579903465eaf648d';
import {confirmProductDialog} from './productos-dialogs.js?v=d64b6adcc46ee7e6db5cfdbf579903465eaf648d';
import {createCategorySession} from './product-categories-session.js?v=d64b6adcc46ee7e6db5cfdbf579903465eaf648d';
import {categoryHierarchy,categoryDescendants} from './product-categories-core.js?v=d64b6adcc46ee7e6db5cfdbf579903465eaf648d';

export function createCategoriesWorkspace({rpc,invoke,actor,can,storeName,onChanged=()=>{},onState=()=>{}}){
 const session=createCategorySession({rpc,invoke,actor,can}),cache=new Map();
 let host=null,shop=null,owner=null,epoch=0,busy=false,message='',query='',direction='asc',sortField='name',data=null,editor=null;
 const valid=(el,n,who)=>host===el&&el?.isConnected&&epoch===n&&owner===who&&actor()===who;
 const language=()=>String((data?.languages.find(l=>l.iso_code==='es'&&String(l.active)==='1')||data?.languages.find(l=>String(l.active)==='1'))?.id||'');
 const localized=()=>categoryHierarchy((data?.items||[]).map(row=>({...row,__label:directoryText(row.name,language())})),{query,direction,sortField});
 function render(){
  if(!host)return;
  const rows=localized(),editable=!!data&&(!data.website||data.connected),name=storeName(shop);
  const heading=(field,label)=>'<th aria-sort="'+(sortField===field?(direction==='asc'?'ascending':'descending'):'none')+'"><button type="button" class="tc-sort-button" data-category-action="sort" data-field="'+field+'" aria-label="Ordenar categorías por '+label+'">'+label+' <span class="tc-sort-arrow" aria-hidden="true">'+(sortField===field?(direction==='asc'?'↑':'↓'):'↕')+'</span></button></th>';
  host.innerHTML='<section class="prd-categories" aria-label="Categorías y subcategorías"><header class="prd-category-heading"><div><h3>Categorías y subcategorías</h3><p>'+esc(name)+(data?.website?' · Web vinculada':' · Tienda física')+'</p></div><div class="inline-actions"><button type="button" class="btn secondary" data-category-action="refresh" '+(busy?'disabled':'')+'>'+(data?.website?'Sincronizar con la web':'Actualizar')+'</button><button type="button" class="btn primary" data-category-action="create" '+(busy||!editable||!can('create')?'disabled':'')+'>Crear categoría</button></div></header><div class="prd-category-tools"><label>Buscar categoría<input type="search" data-category-query placeholder="Nombre, ID o ruta" value="'+esc(query)+'" '+(busy?'disabled':'')+'></label><span>'+rows.length+' categorías'+(data?.checkedAt?' · '+new Date(data.checkedAt).toLocaleString('es-ES',{timeZone:'Europe/Madrid'}):'')+'</span></div><p role="status" class="prd-category-notice">'+esc(busy?'Sincronizando las categorías de '+name+'…':message)+'</p><div class="prd-category-table"><table><thead><tr>'+heading('name','Nombre')+heading('id','ID')+heading('active','Estado')+'<th>Acciones</th></tr></thead><tbody>'+rows.map(row=>'<tr><td><span class="prd-category-name" style="--category-depth:'+Math.min(row.depth,12)+'" title="'+esc(row.path)+'">'+(row.depth?'<span aria-hidden="true">↳ </span>':'')+'<strong>'+esc(row.label)+'</strong></span></td><td>'+esc(row.id)+'</td><td>'+(['1',1].includes(row.active)?'Activa':'Inactiva')+'</td><td><div class="inline-actions"><button class="btn secondary" type="button" data-category-action="edit" data-id="'+esc(row.id)+'" '+(busy||!editable||!can('edit')?'disabled':'')+' aria-label="Editar '+esc(row.label)+'">Editar</button><button class="btn secondary" type="button" data-category-action="child" data-id="'+esc(row.id)+'" '+(busy||!editable||!can('create')?'disabled':'')+' aria-label="Crear subcategoría de '+esc(row.label)+'">Subcategoría</button></div></td></tr>').join('')+(rows.length?'':'<tr><td colspan="4">'+(query?'No hay categorías para esta búsqueda.':'Todavía no hay categorías en esta tienda.')+'</td></tr>')+'</tbody></table></div><p class="small muted">'+(data?.website?'Los cambios se publican únicamente en la web vinculada a '+esc(name)+'. Sincronizar recoge también los cambios hechos en esa web.':'Estas categorías se guardan en '+esc(name)+' y están disponibles en sus productos.')+'</p></section>';
 }
 async function refresh(sync=false){
  if(busy||!host)return;const el=host,n=epoch,who=owner;busy=true;message='';render();
  try{let next=await session.load(shop);if(!valid(el,n,who))return;data=next;render();if(sync&&next.website){next=await session.synchronize();if(!valid(el,n,who))return;data=next;await onChanged(shop);}cache.set(shop,data);message=sync&&data.website?'Categorías de la web verificadas y guardadas en '+storeName(shop)+'.':'';}
  catch(e){if(valid(el,n,who))message=e.message;}
  finally{if(valid(el,n,who)){busy=false;render();}}
 }
 async function edit(id=null,parentId=null){
  if(busy||editor||!data||!can(id?'edit':'create'))return;
  const el=host,n=epoch,who=owner,target=shop,website=data.website,revision=data.revision;
  const row=id?data.items.find(r=>String(r.id)===id):null;if(id&&!row)return;
  const root=!!website&&!!row&&(String(row.id_parent)==='0'||String(row.is_root_category)==='1');
  const excluded=id?categoryDescendants(data.items,id):new Set(),parents=categoryHierarchy(data.items.map(r=>({...r,__label:directoryText(r.name,language())}))).filter(r=>!excluded.has(r.id));
  const dialog=document.createElement('dialog');dialog.className='directory-dialog';editor=dialog;let dirty=false,publishing=false,saved=false;
  const value=field=>directoryText(row?.[field],language());
  dialog.innerHTML='<form><header><div><h3>'+(id?'Editar categoría':parentId?'Crear subcategoría':'Crear categoría')+'</h3><p>'+esc(storeName(target))+(website?' · Web vinculada':' · Tienda física')+'</p></div><button class="btn secondary" type="button" data-category-close aria-label="Cerrar editor de categoría">×</button></header><div class="directory-form-grid"><label>Nombre<input name="name" required maxlength="128" value="'+esc(value('name'))+'"></label><label>Categoría padre<select name="id_parent" '+(root?'disabled':'')+' data-preserve-option-order>'+(website?'<option value="">Selecciona una categoría padre</option>':'<option value="0">Sin categoría padre</option>')+(root?'<option value="'+esc(row.id_parent)+'" selected>Conservar ubicación actual</option>':'')+parents.map(p=>'<option value="'+esc(p.id)+'" '+(String(row?.id_parent??parentId??'')===p.id?'selected':'')+'>'+esc(p.path)+'</option>').join('')+'</select></label><label>Estado<select name="active" '+(root?'disabled':'')+'><option value="1" '+(value('active')!=='0'?'selected':'')+'>Activa</option><option value="0" '+(value('active')==='0'?'selected':'')+'>Inactiva</option></select></label><label>Dirección amigable<input name="link_rewrite" maxlength="128" value="'+esc(value('link_rewrite'))+'" placeholder="Se genera a partir del nombre"></label><label class="span-2">Descripción<textarea name="description" maxlength="100000">'+esc(value('description'))+'</textarea></label><label>Título SEO<input name="meta_title" maxlength="255" value="'+esc(value('meta_title'))+'"></label><label>Descripción SEO<textarea name="meta_description" maxlength="512">'+esc(value('meta_description'))+'</textarea></label></div>'+(website?'<p class="small muted">Editar conserva las demás traducciones y los productos asociados. Al crear se completa el texto en los idiomas de esta web.</p>':'')+'<p role="status" data-category-output></p><footer><button class="btn secondary" type="button" data-category-close>Cancelar</button><button class="btn primary" type="submit">'+(website?'Guardar y sincronizar':'Guardar categoría')+'</button></footer></form>';
  const form=dialog.querySelector('form'),output=dialog.querySelector('[data-category-output]');
  const close=async()=>{if(publishing)return;if(dirty&&!await confirmProductDialog(dialog,'¿Descartar los cambios de esta categoría?',{title:'Cambios sin guardar',acceptLabel:'Descartar'}))return;dialog.close();};
  dialog.oncancel=e=>{e.preventDefault();void close();};dialog.onclick=e=>{e.stopPropagation();if(e.target.closest('[data-category-close]'))void close();};
  form.oninput=e=>{e.stopPropagation();dirty=true;onState({dirty:true,publishing:false});};form.onchange=e=>{e.stopPropagation();dirty=true;onState({dirty:true,publishing:false});};
  dialog.onclose=()=>{dialog.remove();if(editor===dialog)editor=null;onState({dirty:false,publishing:false});};
  form.onsubmit=async e=>{
   e.preventDefault();e.stopPropagation();if(publishing||!valid(el,n,who)||shop!==target||data.website!==website||data.revision!==revision)return;
   const fields=Object.fromEntries(new FormData(form));if(root){fields.id_parent=String(row.id_parent);fields.active='1';}
   publishing=true;onState({dirty,publishing:true});for(const control of form.elements)control.disabled=true;output.textContent=website?'Publicando y verificando en '+storeName(target)+'…':'Guardando categoría…';
   try{const result=await session.save(id,fields);if(!valid(el,n,who))return;saved=true;dirty=false;dialog.close();message='Categoría guardada y verificada en '+storeName(target)+'.';
    if(result.webPublished){try{data=await session.synchronize();message='Categoría sincronizada y verificada en '+storeName(target)+'.';}catch(error){message='La web confirmó el guardado. Falta actualizar su copia en Central: '+error.message;}}
    else data=await session.load(target);
    if(valid(el,n,who)){cache.set(target,data);await onChanged(target);render();}
   }catch(error){if(dialog.isConnected)output.textContent=error.message;}
   finally{publishing=false;onState({dirty,publishing:false});if(!saved)for(const control of form.elements)control.disabled=false;if(root){form.elements.id_parent.disabled=true;form.elements.active.disabled=true;}}
  };
  el.append(dialog);dialog.showModal();form.elements.name.focus();
 }
 function mount(el,store){
  unmount();host=el;shop=store;owner=actor();data=cache.get(store)||null;busy=false;message='';query='';render();
  host.onclick=e=>{const b=e.target.closest('[data-category-action]');if(!b||b.disabled)return;e.stopPropagation();const a=b.dataset.categoryAction;if(a==='refresh')void refresh(true);if(a==='create')void edit();if(a==='edit')void edit(b.dataset.id);if(a==='child')void edit(null,b.dataset.id);if(a==='sort'){const next=b.dataset.field;if(!['name','id','active'].includes(next))return;direction=sortField===next&&direction==='asc'?'desc':'asc';sortField=next;render();}};
  host.onchange=e=>{if(e.target.matches('[data-category-query]')){e.stopPropagation();query=e.target.value;render();}};
  host.oninput=e=>{if(e.target.matches('[data-category-query]')){e.stopPropagation();const start=e.target.selectionStart,end=e.target.selectionEnd;query=e.target.value;render();const input=host.querySelector('[data-category-query]');input.focus({preventScroll:true});if(start!==null)input.setSelectionRange(start,end);}};
  void refresh(false);
 }
 function unmount(){epoch++;if(host){host.onclick=null;host.onchange=null;host.oninput=null;}host=null;busy=false;}
 function dispose(){unmount();editor?.close();editor=null;session.dispose();cache.clear();}
 return {mount,unmount,dispose,refresh,get dirty(){return !!editor;}};
}
