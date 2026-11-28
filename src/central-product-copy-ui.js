import {esc} from './utils.js?v=577653ec754f9cb45a53fd995da6cfeac146ba3a';
import {fieldHelp} from './components.js?v=577653ec754f9cb45a53fd995da6cfeac146ba3a';
import {productPhoto} from './productos-catalog.js?v=577653ec754f9cb45a53fd995da6cfeac146ba3a';

const uuid=value=>typeof value==='string'&&/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(value);
const fold=value=>String(value||'').normalize('NFKC').trim().toLocaleLowerCase('es');
const exact=(rows,source)=>source?rows.filter(row=>fold(row.name)===fold(source.name)):[];
const h=value=>esc(String(value??''));
// Uses the existing Products copy workspace. All writes are initiated by its
// explicit review/confirmation controls, with a durable request for recovery.
export function createCentralProductCopyUI({data,rpc,actor,canCreate,current,onState=()=>{},onSaved=async()=>{},onOpen=()=>{},storage=localStorage}){
 let owner=null,serial=0,source=null,sourceStore='',target='',stores=[],brands=[],suppliers=[],sourceBrands=[],sourceSuppliers=[],targetProducts=[],linkSearch='',linkTarget='',linkUnify=true;
 let fields={},preview=null,result=null,notice='',busy=false,pending=null,request=null,host=null;
 const key=()=>`totus.central-product-copy.v1:${owner}`;
 const valid=()=>owner&&owner===actor()&&current()&&canCreate();
 const state=()=>{if(valid())onState();};
 const checked=(generation=serial)=>{if(generation!==serial||!valid())throw Error('La sesión o el permiso de Productos ha cambiado.');};
 const persist=()=>{checked();storage.setItem(key(),JSON.stringify(pending));if(storage.getItem(key())!==JSON.stringify(pending))throw Error('No se ha podido conservar la solicitud. No se ha enviado la copia.');};
 const clearPending=()=>{storage.removeItem(key());pending=null;};
 function restore(){const saved=JSON.parse(storage.getItem(key())||'null');if(!saved)return;if(!uuid(saved.request)||!uuid(saved.sourceStore)||!uuid(saved.sourceProduct)||!uuid(saved.targetStore)||typeof saved.revision!=='string'||!saved.data||typeof saved.data.name!=='string'||typeof saved.data.reference!=='string'||typeof saved.data.copyStock!=='boolean')throw Error('La solicitud conservada no es válida. No se enviará una copia nueva.');pending=saved;}
 async function run(task){if(busy)return;const generation=serial,guard=()=>checked(generation);busy=true;notice='';state();try{guard();await task(guard);}catch(error){if(generation===serial&&valid())notice=error.message||'No se pudo completar la operación.';}finally{if(generation===serial){busy=false;state();}}}
 async function open({store,id,duplicate=false}){
  if(busy)return;const generation=++serial;owner=actor();source=null;sourceStore=store;target='';fields={};preview=null;result=null;notice='';pending=null;request=crypto.randomUUID();
  await run(async(guard)=>{const checked=guard;
   restore();if(pending){sourceStore=pending.sourceStore;target=pending.targetStore;fields=structuredClone(pending.data);notice='Hay una copia enviada pendiente de comprobar. Consulta su resultado antes de preparar otra.';}
   const context=await data.context();checked();if(generation!==serial)return;stores=context.stores;
   const chosen=pending?.sourceProduct||id;source=await data.product(sourceStore,chosen);checked();if(generation!==serial)return;
   [sourceBrands,sourceSuppliers]=await Promise.all([data.directory(sourceStore,'brands'),data.directory(sourceStore,'suppliers')]);
   checked();if(generation!==serial)return;
   if(!pending){fields={name:duplicate?`${source.name} · copia`:source.name,reference:duplicate?`${source.sku||'PRODUCTO'}-COPIA`:source.sku||'',brandId:'',supplierId:'',copyStock:false};if(duplicate)await chooseTarget(sourceStore,false);}
  });
 }
 async function chooseTarget(value,notify=true){
  checked();if(pending)throw Error('Comprueba primero la copia ya enviada.');if(!stores.some(store=>store.id===value))throw Error('Selecciona una tienda de destino.');
  target=value;preview=null;result=null;brands=[];suppliers=[];targetProducts=[];linkSearch='';linkTarget='';
  const destination=value,generation=serial;
  const next=await Promise.all([data.directory(value,'brands'),data.directory(value,'suppliers'),typeof data.catalogue==='function'&&value!==sourceStore?data.catalogue(value).catch(()=>[]):Promise.resolve([])]);checked();if(generation!==serial||target!==destination)return;
  [brands,suppliers,targetProducts]=next;
  for(const [field,rows,sourceRows,id]of [['brandId',brands,sourceBrands,source.brand_id],['supplierId',suppliers,sourceSuppliers,source.supplier_id]]){
   const matches=exact(rows,sourceRows.find(row=>row.id===id));fields[field]=destination===sourceStore&&rows.some(row=>row.id===id)?id:matches.length===1?matches[0].id:'';
  }
  if(notify)state();
 }
 function args(action,intent=null){const saved=intent||{sourceStore,sourceProduct:source.id,targetStore:target,request,data:fields,revision:preview?.revision||null};return {p_action:action,p_source_store:saved.sourceStore,p_source_product:saved.sourceProduct,p_target_store:saved.targetStore,p_request:saved.request,p_data:structuredClone(saved.data),p_revision:saved.revision};}
 function verifyEnvelope(response,operation){if(!response||response.storeId!==operation.targetStore)throw Error('La respuesta no corresponde a la tienda de destino.');if(response.status!=='absent'&&(response.sourceStoreId!==operation.sourceStore||response.sourceProductId!==operation.sourceProduct))throw Error('La respuesta no corresponde al producto de origen.');}
 async function readBack(response,guard=checked){
  guard();if(response.status!=='completed'||!uuid(response.productId)||response.saved!==true)throw Error('El servidor no ha confirmado la copia. Conserva la solicitud para recuperarla.');
  data.invalidate(response.storeId);const saved=await data.product(response.storeId,response.productId);guard();
  if(saved.store_id!==response.storeId||saved.name!==response.name||saved.sku!==response.reference||saved.source_website||saved.source_id||saved.variants.length!==response.variants||saved.catalogue.length!==response.catalogueItems||saved.catalogue.some(row=>row.active)||saved.variants.some(row=>row.active))throw Error('La copia está registrada pero la relectura no coincide. No la repitas; conserva la solicitud y comprueba el resultado.');
  result=response;clearPending();preview=null;await onSaved(response);guard();notice='Copia guardada y releída en '+(stores.find(store=>store.id===response.storeId)?.name||'la tienda de destino')+'. Está inactiva para que puedas revisarla.';
 }
 async function review(){await run(async(guard)=>{const checked=guard;if(pending)throw Error('Comprueba primero la solicitud ya enviada.');if(!source||!stores.some(store=>store.id===target))throw Error('Selecciona el producto y la tienda de destino.');request=crypto.randomUUID();const response=await rpc('totus_central_product_copy',args('preview'));checked();verifyEnvelope(response,{sourceStore,sourceProduct:source.id,targetStore:target});if(response.status!=='prepared'||typeof response.revision!=='string')throw Error('No se ha podido revisar la copia.');preview=response;notice='Revisión preparada. Confirma para crear una copia nueva en la tienda indicada.';});}
 async function commit(){await run(async(guard)=>{const checked=guard;if(!preview||pending)throw Error('Revisa primero los datos de la copia.');pending={sourceStore,sourceProduct:source.id,targetStore:target,request,data:structuredClone(fields),revision:preview.revision};persist();const response=await rpc('totus_central_product_copy',args('commit',pending));checked();verifyEnvelope(response,pending);await readBack(response,checked);});}
 async function recover(){await run(async(guard)=>{const checked=guard;if(!pending)throw Error('No hay ninguna solicitud pendiente.');const response=await rpc('totus_central_product_copy',args('recover',pending));checked();verifyEnvelope(response,pending);if(response.status==='absent'){clearPending();preview=null;request=crypto.randomUUID();notice='Comprobado: la solicitud no creó ninguna copia. Ya puedes revisar los datos y volver a confirmar.';return;}await readBack(response,checked);});}
 async function saveLink(){
  await run(async(guard)=>{
   const checked=guard;
   if(!source||!target||target===sourceStore||!uuid(linkTarget))throw Error('Selecciona un producto existente en la tienda de destino.');
   const response=await rpc('totus_store_product_link_save',{p_source_store:sourceStore,p_source_product:source.id,p_target_store:target,p_target_product:linkTarget,p_unify_reference:!!linkUnify});
   checked();
   if(response?.ok!==true)throw Error('No se pudo guardar el vínculo entre tiendas.');
   data.invalidate(target);
   if(typeof data.catalogue==='function')targetProducts=await data.catalogue(target).catch(()=>targetProducts);
   checked();
   notice='Productos vinculados entre tiendas'+(linkUnify&&response.unifiedReference?' y referencia igualada a '+response.unifiedReference:'')+'.';
  });
 }
 const select=(name,label,rows,required)=>`<label class="prd-field"><b>${label}</b><select aria-label="${h(label)}" name="${name}" ${required?'required':''} ${busy||pending||result?'disabled':''}><option value="">${required?'Selecciona en destino':'Sin asignar'}</option>${rows.map(row=>`<option value="${h(row.id)}" ${fields[name]===row.id?'selected':''}>${h(row.name)}</option>`).join('')}</select></label>`;
 function linkHtml(locked){
  if(!target||target===sourceStore||pending||result)return '';
  const q=fold(linkSearch);
  const matches=(targetProducts||[]).filter(p=>!q||fold(p.name).includes(q)||fold(p.sku).includes(q)||fold(p.source_id).includes(q)).slice(0,60);
  if(linkTarget&&!matches.some(p=>p.id===linkTarget)&&targetProducts.some(p=>p.id===linkTarget)){const current=targetProducts.find(p=>p.id===linkTarget);if(current)matches.unshift(current);}
  return `<fieldset style="margin-top:14px"><legend>Cotejar / Vincular con producto ya existente en destino</legend><p class="prd-note">Si el producto ya existe en la tienda de destino con otro nombre (SEO), ID o referencia, vincúlalo aquí para futuros traspasos.</p><label class="prd-field"><b>Buscar en destino (nombre, referencia o ID)</b><input type="search" data-central-link-search value="${h(linkSearch)}" placeholder="Ej.: nombre o referencia" ${locked?'disabled':''}></label><label class="prd-field"><b>Producto equivalente en destino</b><select data-central-link-target ${locked?'disabled':''}><option value="">Selecciona un producto (${matches.length} mostrados)</option>${matches.map(p=>`<option value="${h(p.id)}" ${linkTarget===p.id?'selected':''}>${h(p.name)} · Ref: ${h(p.sku||'Sin ref.')}${p.source_id?' · ID #'+h(p.source_id):''}</option>`).join('')}</select></label>${source.sku?`<label><input type="checkbox" data-central-link-unify ${linkUnify?'checked':''} ${locked?'disabled':''}> Igualar referencia en destino a <b>${h(source.sku)}</b></label>`:''}<div class="inline-actions"><button type="button" class="btn secondary" data-central-link-save ${locked||!linkTarget?'disabled':''}>Vincular e igualar referencia</button></div></fieldset>`;
 }
 function render(){
  if(!source)return '<section class="prd-panel"><p role="status">'+h(notice||'Consultando la ficha y sus datos de origen…')+'</p></section>';
  const photo=productPhoto({__central:true,__sourceWebsite:source.source_website||source.details?.metadataWebsite,...source.details?.sourceData},sourceStore),locked=busy||!!pending||!!result;
  return `<section class="prd-copy-view" aria-label="Copia de producto en Central"><div class="prd-copy-panels prd-parallel-editors"><fieldset><legend>ORIGEN: ${h(stores.find(store=>store.id===sourceStore)?.name||'')}</legend><div class="prd-parallel-identity">${photo?`<img class="prd-product-photo" src="${h(photo)}" alt="${h(source.name)}">`:''}<strong>${h(source.name)}</strong></div><dl><dt>Referencia</dt><dd>${h(source.sku||'Sin referencia')}</dd><dt>Combinaciones</dt><dd>${source.variants.length}</dd><dt>Contenido</dt><dd>Ficha, SEO, idiomas, precios, impuestos y datos de las combinaciones.</dd></dl></fieldset><fieldset><legend>DESTINO</legend><form data-central-copy-form><label class="prd-field"><b>Tienda de destino</b><select aria-label="Tienda de destino" name="target" required ${locked?'disabled':''}><option value="">Selecciona una tienda</option>${stores.map(store=>`<option value="${h(store.id)}" ${target===store.id?'selected':''}>${h(store.name)}</option>`).join('')}</select></label><label class="prd-field"><b>Nombre de la copia</b><input name="name" maxlength="255" required value="${h(fields.name)}" ${locked?'disabled':''}></label><label class="prd-field"><b>Referencia de la copia</b><input name="reference" maxlength="120" required value="${h(fields.reference)}" ${locked?'disabled':''}></label>${select('brandId','Marca en destino',brands,!!source.brand_id)}${select('supplierId','Proveedor en destino',suppliers,!!source.supplier_id)}<label><input name="copyStock" type="checkbox" ${fields.copyStock?'checked':''} ${locked?'disabled':''}> Copiar también las cantidades de existencias ${fieldHelp('Copiar existencias','Crea cantidades independientes en el destino. No es un traslado: no descuenta unidades del origen. Déjalo desmarcado para empezar con stock cero.')}</label><p class="prd-note">Se crea una ficha independiente e inactiva en Central. Revisa su disponibilidad antes de venderla.</p><div class="inline-actions">${pending?'<button type="button" class="btn primary" data-central-copy-recover>Comprobar copia enviada</button>':result?'<button type="button" class="btn primary" data-central-copy-open>Abrir copia guardada</button>':`<button class="btn secondary" type="submit" ${busy?'disabled':''}>Revisar copia</button>${preview?`<button type="button" class="btn primary" data-central-copy-commit ${busy?'disabled':''}>Crear copia en ${h(stores.find(store=>store.id===target)?.name||'destino')}</button>`:''}`}</div>${preview?`<p>${preview.variants} combinaciones · ${preview.catalogueItems} artículos · ${h(preview.stock)} unidades de destino.</p>`:''}</form>${linkHtml(locked)}</fieldset></div><p role="status">${h(notice|| (busy?'Comprobando…':''))}</p></section>`;
 }
 function bind(root){host=root;const form=root.querySelector('[data-central-copy-form]');if(!form)return;form.oninput=event=>{if(pending||result)return;const input=event.target;if(['name','reference','copyStock'].includes(input.name)){fields[input.name]=input.type==='checkbox'?input.checked:input.value;preview=null;form.querySelector('[data-central-copy-commit]')?.remove();}};form.onchange=event=>{if(pending||result)return;const input=event.target;if(input.name==='target')void run(()=>chooseTarget(input.value,false));else if(['brandId','supplierId'].includes(input.name)){fields[input.name]=input.value;preview=null;state();}};form.onsubmit=event=>{event.preventDefault();void review();};form.querySelector('[data-central-copy-commit]')?.addEventListener('click',()=>void commit());form.querySelector('[data-central-copy-recover]')?.addEventListener('click',()=>void recover());form.querySelector('[data-central-copy-open]')?.addEventListener('click',()=>{checked();onOpen(result.storeId,result.productId);});const searchInput=root.querySelector('[data-central-link-search]'),targetSelect=root.querySelector('[data-central-link-target]'),unifyInput=root.querySelector('[data-central-link-unify]'),linkBtn=root.querySelector('[data-central-link-save]');if(searchInput)searchInput.oninput=()=>{linkSearch=searchInput.value;state();};if(targetSelect)targetSelect.onchange=()=>{linkTarget=targetSelect.value;state();};if(unifyInput)unifyInput.onchange=()=>{linkUnify=unifyInput.checked;};if(linkBtn)linkBtn.onclick=()=>void saveLink();}
 function dispose(){serial++;host=null;source=null;busy=false;owner=null;}
 return {open,render,bind,dispose,review,commit,recover,get busy(){return busy;},get attempted(){return !!pending;},get hasSource(){return !!source||busy||!!pending;}};
}
