const id=value=>/^(0|[1-9]\d{0,9})$/.test(String(value));
const uuid=value=>/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(value||'');
export function taxPreference(value){
 if(value===undefined)return {allowTaxChanges:false};
 if(!value||Array.isArray(value)||Object.keys(value).some(k=>k!=='allowTaxChanges')||typeof value.allowTaxChanges!=='boolean')throw Error('No se ha confirmado el permiso de edición de impuestos.');
 return {allowTaxChanges:value.allowTaxChanges};
}
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function taxPreferenceHtml(value,editable){return `<form data-tpv-form="tax-preference"><h4>Impuesto del producto</h4><label class="tpv-check"><input type="checkbox" name="allowTaxChanges" ${taxPreference(value).allowTaxChanges?'checked':''} ${editable?'':'disabled'}> Permitir editar el impuesto del producto desde el mostrador</label><details class="tpv-info-help"><summary aria-label="Ayuda: cambio de impuesto">i</summary><div role="note">Requiere permiso de edición de Productos. Cambia el grupo fiscal del producto del catálogo y sus variantes; se aplica a las ventas siguientes de esa tienda. No altera pedidos anteriores. Antes de guardar se revisa y confirma el cambio.</div></details><button type="submit" class="btn primary" ${editable?'':'disabled'}>Guardar edición de impuestos</button></form>`;}

// Uses the same authenticated Products stages as Central, with durable recovery.
export function createCatalogueTaxChange({storage,actor,can,connect}){
 let running=false;
 async function context(scope,productId){
  const owner=actor();
  const guard=()=>{if(!owner||owner!==actor()||!can())throw Error('La sesión o los permisos de impuestos han cambiado.');};
  guard();if(!scope?.connectionId||!Number.isSafeInteger(scope.shopId)||scope.shopId<1||!id(productId)||Number(productId)<1)throw Error('Selecciona un producto de una tienda conectada.');
  const transport=await connect(scope);guard();
  const call=async(action,args)=>{guard();const result=await transport(action,args);guard();if(result?.ok!==true)throw Error('No se ha confirmado la operación del producto.');return result;};
  const read=async()=>{const result=await call('prestashop_item_read',{resource:'products',record_id:String(productId)}),product=result.item;if(String(product?.id)!==String(productId)||!id(product.id_tax_rules_group))throw Error('No se ha podido leer el impuesto actual del producto.');return product;};
  const key='totus:tpv:catalogue-tax:v1:'+encodeURIComponent(owner)+':'+scope.connectionId+':'+scope.shopId+':'+productId;
  return {guard,call,read,key};
 }
 return {
  async review(scope,productId){
   const c=await context(scope,productId),product=await c.read(),groups=[],seen=new Set();
   for(let page=0;page<50;page++){
    const result=await c.call('prestashop_read',{resource:'tax_rule_groups',page,page_size:100});
    if(!Array.isArray(result.rows)||result.rows.length>100||result.possibly_more&&!result.rows.length)throw Error('No se han podido consultar los grupos fiscales.');
    for(const row of result.rows){if(!id(row.id)||Number(row.id)<1||typeof row.name!=='string')throw Error('Grupo fiscal no válido.');if(!seen.has(String(row.id))&&String(row.active)==='1'&&String(row.deleted??'0')==='0'){seen.add(String(row.id));groups.push({id:String(row.id),name:row.name});}}
    if(!result.possibly_more)break;
    if(page===49)throw Error('El listado de grupos fiscales no está completo.');

   }
   const raw=storage.getItem(c.key),pending=raw?JSON.parse(raw):null;
   return {productId:String(productId),before:String(product.id_tax_rules_group),groups:[{id:'0',name:'Sin grupo de impuestos'},...groups],pending:pending?.sent&&!pending.done?pending.group:null};
  },
  async apply(scope,review,group){
   if(running)throw Error('Ya hay un cambio de impuesto en curso.');
   if(!id(group)||!id(review?.before)||!(review.pending===String(group)||review.groups?.some(row=>row.id===String(group))))throw Error('Selecciona un grupo fiscal de esta tienda.');
   running=true;
   try{
    const c=await context(scope,review.productId),raw=storage.getItem(c.key);let journal=raw?JSON.parse(raw):null;
    if(journal?.sent&&!journal.done&&journal.group!==String(group))throw Error('Recupera el cambio enviado antes de elegir otro impuesto.');
    if(!journal||journal.done){
     const product=await c.read();if(String(product.id_tax_rules_group)!==review.before)throw Error('El impuesto ha cambiado desde que abriste el producto. Vuelve a consultarlo.');
     if(review.before===String(group))return {verified:true,changed:false};
     journal={parent:crypto.randomUUID(),step:'tax_'+crypto.randomUUID().replaceAll('-',''),group:String(group),before:review.before,sent:false,done:false};
    }
    if(!uuid(journal.parent)||!/^tax_[a-f0-9]{32}$/.test(journal.step)||!id(journal.group))throw Error('El cambio guardado no es válido.');
    const args={existing_product:true,parent_request_id:journal.parent,product_id:review.productId,kind:'finish',step_key:journal.step,fields:{id_tax_rules_group:journal.group}};
    if(!journal.sent){
     const first=await c.call('prestashop_product_step_prepare',args),product=await c.read();
     if(String(product.id_tax_rules_group)!==journal.before)throw Error('El impuesto cambió durante la revisión. No se ha guardado el cambio.');
     const prepared=await c.call('prestashop_product_step_prepare',args);
     if(first.fingerprint!==prepared.fingerprint||! /^[a-f0-9]{64}$/.test(prepared.fingerprint||'')||prepared.can_commit!==true||prepared.persisted!==false)throw Error('No se puede confirmar el cambio de impuesto.');
     journal.fingerprint=prepared.fingerprint;journal.sent=true;c.guard();storage.setItem(c.key,JSON.stringify(journal));
    }
    if(!/^[a-f0-9]{64}$/.test(journal.fingerprint||''))throw Error('No se ha podido recuperar la identidad del cambio.');
    const result=await c.call('prestashop_product_step_commit',{...args,expected_fingerprint:journal.fingerprint,confirmed:true});
    if(result.persisted!==true||result.verified!==true||String(result.record_id)!==review.productId)throw Error('Cambio enviado sin confirmación. Recupera el mismo cambio antes de repetirlo.');
    if(String((await c.read()).id_tax_rules_group)!==journal.group)throw Error('No se ha confirmado el impuesto guardado. Recupera el mismo cambio.');
    journal.done=true;c.guard();storage.setItem(c.key,JSON.stringify(journal));return {verified:true,changed:true};
   }finally{running=false;}
  }
 };
}

export function createTaxGroupPicker(){
 let active=null;
 const cancel=()=>active?.finish(null);
 function choose(review,name){
  if(active)throw Error('Termina primero la revisión del impuesto.');
  return new Promise(resolve=>{
   const dialog=document.createElement('dialog');let settled=false;
   function finish(value){if(settled)return;settled=true;active=null;if(dialog.open)dialog.close();dialog.remove();resolve(value);}
   active={finish};dialog.className='tpv-quantity-dialog';dialog.setAttribute('aria-labelledby','tpvTaxTitle');
   const groups=[...review.groups];if(review.pending&&!groups.some(g=>g.id===review.pending))groups.push({id:review.pending,name:'Impuesto del cambio pendiente #'+review.pending});
   dialog.innerHTML=`<form><h3 id="tpvTaxTitle">Impuesto del producto</h3><strong>${esc(name)}</strong><p class="note">El cambio afecta al producto del catálogo y a todas sus variantes. Se conserva el precio base; el precio con impuestos puede cambiar. Los pedidos anteriores se conservan.</p><label>Grupo de impuestos<select name="taxGroup" ${review.pending?'disabled':''}>${groups.map(g=>`<option value="${esc(g.id)}" ${g.id===(review.pending||review.before)?'selected':''}>${esc(g.name)}</option>`).join('')}</select></label><label class="tpv-check"><input type="checkbox" required> He revisado el cambio y su alcance</label><footer><button type="button" class="btn secondary" data-tax-cancel>Cancelar</button><button type="submit" class="btn primary">${review.pending?'Recuperar cambio enviado':'Guardar impuesto del producto'}</button></footer></form>`;
   dialog.addEventListener('cancel',e=>{e.preventDefault();finish(null);});dialog.addEventListener('close',()=>finish(null));
   dialog.querySelector('[data-tax-cancel]').onclick=()=>finish(null);
   dialog.querySelector('form').onsubmit=e=>{e.preventDefault();if(!dialog.querySelector('input').checked)return;finish(review.pending||dialog.querySelector('select').value);};
   document.body.append(dialog);dialog.showModal();dialog.querySelector(review.pending?'input':'select').focus();
  });
 }
 return {choose,cancel};
}

export function createTaxChoice(){
 let active=null;const cancel=()=>active?.(null);
 return {cancel,choose(name,review){if(active)throw Error('Termina primero el cambio de impuesto.');return new Promise(resolve=>{
  const dialog=document.createElement('dialog');dialog.className='tpv-quantity-dialog';let done=false;
  const finish=value=>{if(done)return;done=true;active=null;if(dialog.open)dialog.close();dialog.remove();resolve(value);};active=finish;
  dialog.innerHTML=`<form><h3>Impuesto del producto</h3><strong>${esc(name)}</strong><p>El cambio se guarda en el catálogo y afecta a todas las variantes. Los pedidos anteriores se conservan.</p><label>Grupo fiscal<select name="group" ${review.pending?'disabled':''}>${review.groups.map(row=>`<option value="${esc(row.id)}" ${row.id===(review.pending||review.before)?'selected':''}>${esc(row.name)}</option>`).join('')}</select></label><label class="tpv-check"><input name="confirmed" type="checkbox" required> Confirmo el cambio fiscal de este producto</label><footer><button type="button" class="btn secondary" data-tax-cancel>Cancelar</button><button class="btn primary" type="submit">${review.pending?'Recuperar cambio enviado':'Guardar impuesto del producto'}</button></footer></form>`;
  dialog.addEventListener('cancel',event=>{event.preventDefault();finish(null);});dialog.addEventListener('close',()=>finish(null));dialog.querySelector('[data-tax-cancel]').onclick=()=>finish(null);
  dialog.querySelector('form').onsubmit=event=>{event.preventDefault();if(dialog.querySelector('[name=confirmed]').checked)finish(review.pending||dialog.querySelector('select').value);};document.body.append(dialog);dialog.showModal();dialog.querySelector('select').focus();
 });}};
}
