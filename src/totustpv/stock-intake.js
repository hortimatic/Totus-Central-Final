import {LABEL_PAPERS,labelSheetHtml,printBarcodeLabels} from './barcode-labels.js?v=2f75e2627eb4533ce333dc5aa04386b8e9820e89';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const statusLabel=status=>({pending:'Preparada',processing:'En curso',verified:'Verificada',uncertain:'Pendiente de recuperar',dispatched:'Consultando resultado',cancelled:'Cancelada'}[status]||status);
export function createStockIntake({adapter,canEdit=()=>false}){
 let rows=[],reason='',receipts=[],active=null,labels=null,paper='thermal58',epoch=0;
 const labelStyle={showName:true,showPrice:true,showReference:false};
 const hasDraft=()=>rows.length>0||reason.trim()!=='';
 const pending=()=>receipts.some(row=>['pending','processing'].includes(row.status));
 function reset(){epoch++;rows=[];reason='';receipts=[];active=null;labels=null;}
 function add(product){
  if(!canEdit())throw Error('No tienes permiso para registrar mercancía.');
  if(product.chooseVariant)throw Error('Elige la variante del artículo.');
  const row=rows.find(row=>row.productId===product.id);
  if(row&&row.quantity>=10000)throw Error('Una línea admite hasta 10.000 unidades.');
  if(row)row.quantity++;else{if(rows.length>=200)throw Error('Una entrada admite hasta 200 artículos distintos.');rows.push({productId:product.id,name:product.name,quantity:1});}
 }
 function labelsHtml(){
  if(!active?.lines.some(line=>line.status==='verified')||typeof adapter().stockReceiptLabels!=='function')return '';
  let preview='';if(labels?.items.length)try{preview=labelSheetHtml({...labels,items:[{...labels.items[0],quantity:1}]},{paper,...labelStyle,receivedQuantities:true});}catch(error){preview=`<p class="note" role="status">${esc(error.message)}</p>`;}
  return `<section class="tpv-stock-review"><h4>Etiquetas de la mercancía recibida <details class="tpv-info-help"><summary aria-label="Ayuda: etiquetas de mercancía">i</summary><div role="note">Una etiqueta por unidad recibida y verificada. Puedes ajustar las copias sin cambiar las existencias. Los productos sin código se indican para asignarlo antes de imprimir. El precio es el de mostrador con IVA en el momento de consultar. Imprime al 100 %, sin ajustar a página.</div></details></h4><button type="button" class="btn secondary" data-tpv-stock-labels>Preparar etiquetas recibidas</button>${labels?`
   <div class="tpv-receipt-label-options"><label>Papel<select data-tpv-stock-label-paper>${Object.entries(LABEL_PAPERS).map(([id,profile])=>`<option value="${id}" ${id===paper?'selected':''}>${esc(profile.label)}</option>`).join('')}</select></label>${Object.entries({showName:'Nombre',showPrice:'Precio con IVA',showReference:'Referencia'}).map(([key,title])=>`<label><input type="checkbox" data-tpv-stock-label-style="${key}" ${labelStyle[key]?'checked':''}> ${title}</label>`).join('')}</div>
   ${labels.skipped.length?`<p class="note" role="status">${labels.skipped.length} artículos sin código válido: ${labels.skipped.map(row=>esc(active.lines.find(line=>line.productId===row.productId&&line.attributeId===row.attributeId)?.label||row.productId)).join(', ')}. Asigna su código y vuelve a preparar las etiquetas.</p>`:''}
   <div class="tpv-receipt-label-list">${labels.items.map(row=>`<label><span>${esc(row.name)} ${esc(row.variantName)} · ${new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(row.priceCents/100)}</span><input aria-label="Etiquetas de ${esc(row.name)} ${esc(row.variantName)}" type="number" min="0" max="${row.receivedQuantity}" step="1" value="${row.quantity}" data-tpv-stock-label-quantity="${row.productId}:${row.attributeId}"></label>`).join('')}</div>
   <p>${labels.items.reduce((n,row)=>n+(Number.isSafeInteger(row.quantity)?row.quantity:0),0)} etiquetas seleccionadas</p><div class="tpv-barcode-label-preview" aria-label="Ejemplo de etiqueta recibida">${preview}</div><button type="button" class="btn primary" data-tpv-stock-label-print ${!labels.items.length?'disabled':''}>Imprimir etiquetas</button>`:''}</section>`;
 }
 function html(){return `<section class="tpv-stock-intake"><h4>Mercancía recibida</h4><p>Escanea cada unidad o elige un artículo. Si repites un código, se suma una unidad a su línea.</p>
  <form data-tpv-form="stock-batch"><label>Albarán o motivo<input name="reason" data-tpv-stock-reason maxlength="500" required value="${esc(reason)}" placeholder="Ej.: Albarán del proveedor 1582"></label>
  <div class="tpv-stock-rows">${rows.map(row=>`<div class="tpv-stock-row"><strong>${esc(row.name)}</strong><label>Unidades recibidas<input data-tpv-stock-quantity="${esc(row.productId)}" type="number" min="1" max="10000" step="1" required value="${row.quantity}"></label><button class="btn secondary" type="button" data-tpv-stock-remove="${esc(row.productId)}" aria-label="Quitar ${esc(row.name)}">×</button></div>`).join('')||'<p class="tpv-empty">Todavía no has añadido artículos a esta entrada.</p>'}</div>
  <p><b>${rows.length}</b> artículos · <b>${rows.reduce((n,row)=>n+row.quantity,0)}</b> unidades</p><button class="btn primary" type="submit" ${!rows.length||!canEdit()?'disabled':''}>Guardar entrada para revisar</button></form>
  ${active?`<section class="tpv-stock-review"><h4>${esc(active.reason)} · ${esc(statusLabel(active.status))}</h4><p>La entrada ya está guardada en Central. Cada línea conserva su resultado aunque cierres el navegador.</p>
  ${active.lines.map(line=>`<div class="tpv-stock-result"><span>${esc(line.label)} · ${line.quantity} ud.</span><strong>${esc(statusLabel(line.status))}</strong>${line.result?`<small>Existencias: ${line.result.before} → ${line.result.after}</small>`:''}</div>`).join('')}
  <div class="inline-actions">${['pending','processing'].includes(active.status)?`<button type="button" class="btn primary" data-tpv-stock-run="${esc(active.id)}">${active.status==='pending'?'Confirmar y registrar mercancía':'Recuperar y continuar entrada'}</button>`:''}${active.status==='pending'?`<button type="button" class="btn secondary" data-tpv-stock-cancel="${esc(active.id)}">Cancelar entrada sin registrar</button>`:''}</div></section>`:''}
  ${labelsHtml()}
  <details class="tpv-stock-history" ${pending()?'open':''}><summary>Entradas guardadas · esta caja</summary><button class="btn secondary" type="button" data-tpv-stock-refresh>Actualizar entradas</button>${receipts.map(row=>`<button class="btn secondary" type="button" data-tpv-stock-receipt="${esc(row.id)}">${esc(row.reason)} · ${esc(statusLabel(row.status))}</button>`).join('')||'<p>No hay entradas guardadas en esta sesión.</p>'}</details></section>`;}
 async function load(){labels=null;receipts=await adapter().stockReceipts();if(active)active=receipts.find(row=>row.id===active.id)||active;}
 async function save(){
  if(!canEdit()||!rows.length||!reason.trim())throw Error('Añade artículos e indica el albarán o motivo.');
  if(rows.some(row=>!Number.isSafeInteger(row.quantity)||row.quantity<1||row.quantity>10000))throw Error('Indica unidades enteras entre 1 y 10.000.');
  active=await adapter().createStockReceipt({reason:reason.trim(),lines:structuredClone(rows)});rows=[];reason='';await load();
 }
 async function run(id){
  if(!canEdit())throw Error('No tienes permiso para registrar mercancía.');
  active=await adapter().getStockReceipt(id);
  for(let step=0;step<200&&['pending','processing'].includes(active.status);step++){
   const before=active.lines.filter(line=>line.status==='verified').length;
   active=await adapter().advanceStockReceipt(id);
   if(active.lines.filter(line=>line.status==='verified').length<=before)break;
  }
  await load();
  if(['pending','processing'].includes(active.status))throw Error('Hay una línea pendiente de recuperar. Pulsa Recuperar y continuar entrada; las líneas verificadas se conservan.');
 }
 async function prepareLabels(){
  if(!canEdit()||!active||typeof adapter().stockReceiptLabels!=='function')throw Error('No tienes acceso a las etiquetas de esta entrada.');
  const born=epoch,id=active.id,result={items:[],skipped:[]};let after=0;
  for(let page=0;page<4;page++){
   const response=await adapter().stockReceiptLabels(id,{after});
   if(born!==epoch||active?.id!==id||!canEdit())throw Error('La entrada o el puesto han cambiado.');
   if(response?.receiptId!==id||response.after!==after||!Array.isArray(response.items)||!Array.isArray(response.skipped)||response.items.length+response.skipped.length>50)throw Error('No se han confirmado las etiquetas de esta entrada.');
   result.items.push(...response.items.map(row=>({...row,receivedQuantity:row.quantity})));result.skipped.push(...response.skipped);
   if(response.hasMore===false){labels=result;return;}
   if(response.hasMore!==true||!Number.isSafeInteger(response.nextAfter)||response.nextAfter<=after)throw Error('No se ha podido continuar la lista de etiquetas.');
   after=response.nextAfter;
  }
  throw Error('No se ha podido consultar la lista completa de etiquetas.');
 }
 async function printLabels(){
  if(!labels)throw Error('Prepara las etiquetas antes de imprimir.');
  const reviewed=JSON.stringify(labels.items.map(row=>[row.productId,row.attributeId,row.code,row.priceCents,row.receivedQuantity]));
  const wanted=new Map(labels.items.map(row=>[row.productId+':'+row.attributeId,row.quantity]));
  if([...wanted.values()].some(n=>!Number.isSafeInteger(n)||n<0))throw Error('Indica cantidades enteras de etiquetas.');
  // Re-read codes and prices. Printing never repeats the stock operation.
  await prepareLabels();
  if(JSON.stringify(labels.items.map(row=>[row.productId,row.attributeId,row.code,row.priceCents,row.receivedQuantity]))!==reviewed)throw Error('Han cambiado códigos, precios o unidades. Revisa las etiquetas actualizadas antes de imprimir.');
  const items=labels.items.map(row=>({...row,quantity:wanted.get(row.productId+':'+row.attributeId)??0}));
  if(items.some(row=>row.quantity>row.receivedQuantity))throw Error('No puedes imprimir más copias que unidades recibidas en esta tanda.');
  const selected=items.filter(row=>row.quantity>0);if(!selected.length)throw Error('Selecciona al menos una etiqueta.');
  const born=epoch,id=active.id;
  printBarcodeLabels({items:selected},{paper,...labelStyle,receivedQuantities:true},{current:()=>born===epoch&&active?.id===id&&canEdit()});
 }
 return Object.freeze({html,prepareLabels,printLabels,add,reset,hasDraft,pending,load,save,run,
  snapshot:()=>structuredClone({rows,reason,receipts,active}),
  input(target){
   if(target.hasAttribute('data-tpv-stock-label-paper')){if(Object.hasOwn(LABEL_PAPERS,target.value))paper=target.value;return true;}
   if(target.dataset.tpvStockLabelStyle&&Object.hasOwn(labelStyle,target.dataset.tpvStockLabelStyle)){labelStyle[target.dataset.tpvStockLabelStyle]=target.checked;return true;}
   if(target.dataset.tpvStockLabelQuantity){const row=labels?.items.find(row=>row.productId+':'+row.attributeId===target.dataset.tpvStockLabelQuantity);if(row)row.quantity=Number(target.value);return true;}
   if(target.hasAttribute('data-tpv-stock-reason')){reason=target.value;return true;}
   if(target.hasAttribute('data-tpv-stock-quantity')){const row=rows.find(row=>row.productId===target.dataset.tpvStockQuantity);if(row)row.quantity=Number(target.value);return true;}return false;},
  remove(id){rows=rows.filter(row=>row.productId!==id);},
  async select(id){epoch++;labels=null;active=await adapter().getStockReceipt(id);},
  async cancel(id){active=await adapter().cancelStockReceipt(id);await load();}
 });
}
