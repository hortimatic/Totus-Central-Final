import {workstationIcon} from './workstation-visual.js?v=b05ab9860f07aeda52ff72779f0b103c8b10b724';
import {REFERENCE_PREFERENCE_FIELDS,normalizeReferencePreferences} from './reference-preferences.js?v=b05ab9860f07aeda52ff72779f0b103c8b10b724';
import {REFERENCE_SETTINGS} from './reference-settings-catalogue.js?v=b05ab9860f07aeda52ff72779f0b103c8b10b724';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const folderIcon='<svg viewBox="0 0 160 112" aria-hidden="true"><path fill="#277da8" d="M2 15Q2 5 12 5h40l18 14h78q10 0 10 10v67H2z"/><path fill="#c5e2ef" d="M5 29h148v68H5z"/><path fill="#349bd4" d="M0 38q0-9 10-9h140q10 0 10 9v65q0 9-10 9H10q-10 0-10-9z"/></svg>';
export const productIcon='<svg viewBox="0 0 120 120" aria-hidden="true"><path fill="#2e89ba" d="M60 5 111 33 60 62 9 33zM5 42l48 28v47L5 89zm110 0L67 70v47l48-28z"/></svg>';
const helpText={
 'CFG-01-01':'Emite un sonido al incorporar una unidad al ticket. No modifica el precio ni las existencias.',
 'CFG-01-02':'Muestra u oculta el desglose del IVA. Los impuestos se siguen calculando en ambos casos.',
 'CFG-02-02':'El logo se configura en la cabecera de este apartado. Desactiva esta opción para imprimir sin imagen.',
 'CFG-02-27':'Muestra el precio por kg, litro u otra unidad del producto cuando se guardó con la venta. No reconstruye precios de pedidos antiguos con datos actuales. El ticket regalo lo oculta.',
 'CFG-02-16':'Muestra el dato elegido de la dirección de facturación del cliente. Requiere Datos del cliente activado y permiso para consultar Clientes. El ticket regalo no lo muestra.',
 'UI-CUSTOMER-EXTRA-FIELD':'Elige un dato ya guardado en la dirección de facturación. No crea ni modifica los datos del cliente.',
 'UI-CUSTOMER-EXTRA-LABEL':'Nombre con el que aparecerá este dato en el ticket.',
 'CFG-02-22':'Abre la impresión después de confirmar una venta. Puedes volver a imprimir desde Tickets.',
 'CFG-09-13':'Elige cómo se presentan los precios del catálogo. El cobro conserva el cálculo fiscal de la tienda.',
 'CFG-09-14':'Muestra las unidades disponibles junto al artículo. Su visibilidad no autoriza vender sin existencias.',
 'CFG-09-15':'Muestra la referencia interna junto al nombre del producto.'
};
const fieldHelp=(f,binding)=>helpText[f.id]||(binding.member?'Incluye este campo entre los criterios de búsqueda de artículos.':binding.initialCategory?'Categoría que se muestra al abrir el catálogo del puesto seleccionado.':binding.text?'Este texto se incluye en la presentación del documento según las opciones activas.':binding.group==='receipt'?'Se aplica a los tickets del puesto seleccionado. La vista previa permite revisar su presentación antes de imprimir.':binding.group==='customerDisplay'?'Se aplica a la pantalla para cliente del puesto seleccionado.':f.label+'. Guarda los cambios para aplicarlos al puesto seleccionado.');
const fieldHtml=(f,settings,editable,draft,categories)=>{
 f={...f,label:({'CFG-01-02':'Mostrar desglose del IVA','CFG-02-02':'Mostrar logo del establecimiento'}[f.id]||f.label)};
 const binding=REFERENCE_PREFERENCE_FIELDS[f.id];
 if(binding){
  const value=Object.hasOwn(draft,f.id)?draft[f.id]:binding.group==='root'?settings[binding.key]:binding.member?settings[binding.group][binding.key].includes(binding.member):settings[binding.group][binding.key],disabled=editable?'':'disabled';
  const control=binding.initialCategory?`<select name="${f.id}" id="reference-${f.id}" aria-label="${esc(f.label)}" ${disabled}>${[{id:0,label:'Todas las categorías'},...categories.filter(row=>!settings.catalogue.excludedCategories.includes(row.id))].map(row=>`<option value="${row.id}" ${String(row.id)===String(value)?'selected':''}>${esc(row.label||row.name)}</option>`).join('')}</select>`:binding.categories?`<div class="tpv-reference-category-choice"><select multiple name="${f.id}" aria-label="${esc(f.label)}" id="reference-${f.id}" ${disabled}>${categories.map(row=>`<option value="${row.id}" ${Array.isArray(value)&&value.map(String).includes(String(row.id))?'selected':''}>${esc(row.label||row.name)}</option>`).join('')}</select><button type="button" class="btn secondary" data-tpv-action="reference-clear-categories" ${disabled}>Mostrar todas las categorías</button></div>`:binding.options?`<select name="${f.id}" id="reference-${f.id}" aria-label="${esc(f.label)}" ${disabled}>${binding.options.map(([key,label])=>`<option value="${esc(key)}" ${String(key)===String(value)?'selected':''}>${esc(label)}</option>`).join('')}</select>`:binding.text?`<${binding.text>80?'textarea':'input'} name="${f.id}" id="reference-${f.id}" aria-label="${esc(f.label)}" maxlength="${binding.text}" ${binding.text>80?'rows="3"':`value="${esc(value)}"`} ${disabled}>${binding.text>80?esc(value):''}${binding.text>80?'</textarea>':''}`:binding.color?`<input type="color" name="${f.id}" id="reference-${f.id}" value="${esc(value)}" ${disabled}>`:`<div class="tpv-reference-switch" role="group" aria-label="${esc(f.label)}">${[[true,'On'],[false,'Off']].map(([key,label])=>`<label><input type="radio" name="${f.id}" value="${key}" ${String(key)===String(value)?'checked':''} ${disabled}><span>${label}</span></label>`).join('')}</div>`;
  return `<div class="tpv-reference-option"><div class="tpv-setting-label"><label for="reference-${f.id}">${esc(f.label)}</label><details class="tpv-info-help"><summary aria-label="Ayuda: ${esc(f.label)}">i</summary><div role="note">${esc(fieldHelp(f,binding))}</div></details></div>${control}</div>`;
 }

 return `<div class="tpv-reference-option tpv-option-unavailable"><span class="tpv-option-label">${esc(f.label)}</span><span class="tpv-option-status">No disponible aquí</span></div>`;
};
function preferenceGroupsHtml(section,fields,settings,editable,draft,categories){
 const sectionGroups={
  General:[['Venta y artículos',[1,2,3,4,5,6,7]],['Equipo y accesos',[8,9,10,11]]],
  Interfaz:[['Distribución del mostrador',[1,2,3,4,5,6]],['Selección de artículos',[7,8,9,10,11,12]],['Precios, existencias y almacenes',[13,14,15,16,17]]],
  Buscador:[['Disponibilidad y categorías',[1,2,3]],['Datos para buscar artículos',[4,5,6,7,8]]],
  'Funciones especiales':[['Pedidos y documentos',[1,2,3,4]],['Balanza y códigos',[5,6,7,9]],['Operativa del establecimiento',[8,10,11,12,13]]],
  'Estados y formas de pago':[['Formas de cobro',[1,2,3,4,5,6,7]],['Confirmación del pago',[8,9,10]],['Administración de cobros',[11,12,13,14,15,16]]]
 };
 const groups=section==='Ticket'?[
  ['Cabecera y datos del establecimiento',[2,4,5,9,18,19,34,35,37]],
  ['Datos del cliente',[10,11,12,13,14,15,16,'UI-CUSTOMER-EXTRA-FIELD','UI-CUSTOMER-EXTRA-LABEL']],
  ['Artículos y columnas',[24,25,26,27,28,29,32,38,39]],
  ['Totales y descuentos',[17,30,31,33,36,41,42,43,44]],
  ['Impresión y documentos',[20,21,22,23,40]]
 ]:sectionGroups[section];
 if(!groups)return fields.map(f=>fieldHtml(f,settings,editable,draft,categories)).join('');
 const used=new Set();const blocks=groups.map(([title,ids],index)=>{const items=fields.filter(f=>ids.includes(f.id)||ids.includes(Number(f.id.split('-').at(-1))));items.forEach(f=>used.add(f.id));return items.length?`<details class="tpv-settings-group" ${index===0?'open':''}><summary>${esc(title)}<span>${items.length} opciones</span></summary><div>${items.map(f=>fieldHtml(f,settings,editable,draft,categories)).join('')}</div></details>`:'';});
 const other=fields.filter(f=>!used.has(f.id));if(other.length)blocks.unshift(`<div class="tpv-settings-group-extra">${other.map(f=>fieldHtml(f,settings,editable,draft,categories)).join('')}</div>`);
 return blocks.join('');
}
export function receiptSetupFieldsHtml(receipt,{disabled=false,preview='',numbering=false,loyalty=false,promotion=false}={}){
 const settings=normalizeReferencePreferences({receipt}),original=REFERENCE_SETTINGS.find(g=>g.name==='Ticket');
 const fields=[...original.fields,{id:'UI-CUSTOMER-EXTRA-FIELD',label:'Dato adicional que se imprime'},{id:'UI-CUSTOMER-EXTRA-LABEL',label:'Título del dato adicional'}].filter(f=>REFERENCE_PREFERENCE_FIELDS[f.id]?.group==='receipt');
 const draft=Object.fromEntries(fields.filter(f=>Object.hasOwn(receipt,REFERENCE_PREFERENCE_FIELDS[f.id].key)).map(f=>[f.id,receipt[REFERENCE_PREFERENCE_FIELDS[f.id].key]]));
 const pending=original.fields.filter(f=>(numbering?['CFG-02-17','CFG-02-36']:['CFG-02-03','CFG-02-06','CFG-02-07','CFG-02-08','CFG-02-17','CFG-02-36']).includes(f.id)&&!(loyalty&&f.id==='CFG-02-36')&&!(promotion&&f.id==='CFG-02-17'));
 return `<div class="tpv-receipt-setup-layout"><fieldset ${disabled?'disabled':''}>${preferenceGroupsHtml('Ticket',fields,settings,!disabled,draft,[])}${pending.length?`<details class="tpv-settings-group"><summary>Funciones aún pendientes de completar</summary><div>${pending.map(f=>`<div class="tpv-reference-option" data-setting-requirement="${f.id}"><span>${esc(f.label)}</span><span class="tpv-option-status">Pendiente</span></div>`).join('')}</div></details>`:''}</fieldset><aside class="tpv-settings-ticket-preview"><h5>Vista previa</h5><div data-receipt-setup-preview>${preview}</div></aside></div>`;
}
export function referenceSettingsHtml(section='General',{values={},editable=false,draft={},practice=false,preview='',categories=[],connectedHtml='',coveredIds=[],scopeHtml='',brandingHtml='',administrationHtml='',generalSetupHtml='',onlineOrdersHtml=''}={}){
 const settings=normalizeReferencePreferences(values);
 const original=REFERENCE_SETTINGS.find(g=>g.name===section)||REFERENCE_SETTINGS[0];
 const fields=(section==='Interfaz'?[{id:'UI-VIEW-MODE',label:'Vista del catálogo al iniciar'},...original.fields]:section==='Ticket'?[...original.fields,{id:'UI-CUSTOMER-EXTRA-FIELD',label:'Dato adicional que se imprime'},{id:'UI-CUSTOMER-EXTRA-LABEL',label:'Título del dato adicional'}]:original.fields).filter(f=>!coveredIds.includes(f.id)&&(!connectedHtml||!f.id.startsWith('CFG-13-')));
 const supported=fields.filter(f=>REFERENCE_PREFERENCE_FIELDS[f.id]),pending=fields.filter(f=>!REFERENCE_PREFERENCE_FIELDS[f.id]);
 return `<section class="tpv-reference-settings" aria-label="Configuración de TotusTPV">
 <header><div><small>TOTUSTPV · AJUSTES</small><h3>Configuración</h3></div><button type="button" class="btn secondary" data-tpv-action="sale">Volver al mostrador</button></header>${scopeHtml}
 <div class="tpv-reference-settings-layout"><nav aria-label="Apartados de configuración"><label class="tpv-settings-mobile-section">Apartado<select aria-label="Apartado de configuración" data-tpv-settings-section>${REFERENCE_SETTINGS.map(g=>`<option value="${esc(g.name)}" ${g===original?'selected':''}>${esc(g.name)}</option>`).join('')}</select></label><label class="tpv-settings-search">Buscar un ajuste<input type="search" data-tpv-settings-search placeholder="Logo, permisos, stock…" autocomplete="off"></label><p class="tpv-settings-search-status" data-tpv-settings-search-status role="status" hidden></p>${REFERENCE_SETTINGS.map(g=>`<button type="button" class="${g===original?'active':''}" data-tpv-reference-section="${esc(g.name)}" data-tpv-settings-keywords="${esc([g.name,...g.fields.map(f=>f.label)].join(' '))}" aria-current="${g===original?'page':'false'}">${esc(g.name)}</button>`).join('')}</nav>
 <article><header class="tpv-settings-section-head"><h4>${esc(original.name)}</h4><p class="tpv-reference-status">${generalSetupHtml?'Ajustes guardados en Central · no requieren una web.':practice?'Modo práctica · cambios guardados en este navegador.':'Ajustes del puesto seleccionado · sujetos a tus permisos.'}</p></header>
 <div class="tpv-settings-editor"><div class="tpv-settings-fields">
 ${generalSetupHtml}${generalSetupHtml&&section==='Estados y formas de pago'?`<details class="tpv-settings-card tpv-settings-pending"><summary>Funciones pendientes de completar</summary><ul>${original.fields.filter(f=>!coveredIds.includes(f.id)&&!['CFG-04-06','CFG-04-07','CFG-04-08','CFG-04-09','CFG-04-11','CFG-04-12'].includes(f.id)).map(f=>`<li>${esc(f.label)}</li>`).join('')}</ul></details>`:''}${generalSetupHtml&&section==='Permisos'?`<details class="tpv-settings-card tpv-settings-pending"><summary>Confirmaciones y reglas de edición</summary><p>El cambio de operador, su identificación y la edición de artículos se configuran en General. Las confirmaciones sensibles se preparan en este apartado y se aplican al asignar el puesto. La autorización de totales negativos y la edición de pedidos ya confirmados siguen pendientes.</p></details>`:''}${generalSetupHtml&&section==='Devoluciones'?'<section class="tpv-settings-card"><h5>Importes y documentos</h5><p>Las devoluciones verificadas generan su abono y no pueden superar el importe pendiente de la venta original, incluidos sus descuentos.</p><button type="button" class="btn secondary" data-tpv-reference-section="Ticket">Configurar ajuste de puntos en Ticket</button><details class="tpv-settings-pending"><summary>Opciones pendientes de completar</summary><ul><li>Tratamiento del saldo sobrante y vales de devolución</li><li>Referencia segura del cobro original configurable</li><li>Consulta entre establecimientos autorizados</li></ul></details></section>':''}${generalSetupHtml&&section==='Funciones especiales'?`${onlineOrdersHtml}<section class="tpv-settings-card"><h5>Identificación de productos</h5><button type="button" class="btn secondary" data-tpv-reference-section="Códigos barras">Configurar generador de códigos de barras</button><details class="tpv-settings-pending"><summary>Opciones pendientes de completar</summary><ul>${original.fields.filter(f=>!coveredIds.includes(f.id)&&!['CFG-06-01','CFG-06-02','CFG-06-03','CFG-06-04','CFG-06-09','CFG-06-10','CFG-06-11'].includes(f.id)).map(f=>'<li>'+esc(f.label)+'</li>').join('')}</ul></details></section>`:''}${generalSetupHtml?'':` ${section==='Ticket'&&brandingHtml?`<div class="tpv-settings-card">${brandingHtml}</div>`:''}
 ${supported.length?`<form data-tpv-form="reference-preferences" class="tpv-settings-card"><header><h5>Presentación y uso</h5></header>${preferenceGroupsHtml(section,supported,settings,editable,draft,categories)}<footer><button type="submit" class="btn primary" ${!editable?'disabled':''}>Guardar cambios</button></footer></form>`:''}
 ${connectedHtml?`<div class="tpv-reference-connected">${connectedHtml}</div>`:''}
 ${pending.length?`<details class="tpv-settings-card tpv-settings-pending" ${!supported.length&&!connectedHtml?'open':''}><summary>${practice&&section==='General'?'Ajustes administrativos de la tienda':'Opciones todavía no disponibles aquí'} <span>${pending.length}</span></summary><p>${practice?'La práctica no configura los permisos ni las reglas de una tienda real. Selecciona un puesto conectado para administrar sus ajustes.':'Estas opciones todavía no están conectadas en este puesto.'}</p>${practice?administrationHtml:''}${pending.map(f=>fieldHtml(f,settings,false,draft,categories)).join('')}</details>`:''}
`}
 </div>${section==='Ticket'&&!generalSetupHtml&&preview?`<aside class="tpv-settings-ticket-preview"><h5>Vista previa del ticket</h5><p>Ejemplo de impresión</p><div data-tpv-reference-preview>${preview}</div><p data-tpv-reference-preview-feedback role="status"></p></aside>`:''}</div></article></div></section>`;
}

export function referenceActionsHtml(live,available={}){
 const groups=[['Artículos y existencias','Mercancía, recuentos y altas sin salir del TPV',[
 ['stock','Entrada de mercancía','Registra las unidades recibidas','store',live&&available.stock],
 ['inventory','Inventario','Cuenta, revisa diferencias y ajusta existencias','drawer',available.inventory],
 ['new-product','Nuevo producto','Da de alta artículos y sus variantes','store',live&&available.newProduct],
 ['new-customer','Nuevo cliente','Crea su ficha y continúa con la venta','user',live&&available.newCustomer]]],
 ['Operaciones de venta','Recupera trabajo pendiente y consulta los documentos',[
 ...(available.credits?[['credits','Saldos pendientes','Consulta y cobra ventas a crédito','user',true]]:[]),
 ['drafts','Tickets aparcados','Continúa una venta guardada','cart',live||available.parking],
 ['budgets','Presupuestos','Prepara y convierte propuestas','drawer',live],
 ['history','Pedidos y devoluciones','Consulta ventas, documentos y reintegros','cart',true],
 ['session','Caja y cierre','Movimientos, arqueo y cierre de jornada','drawer',true]]]];
 return `<section class="tpv-reference-actions" aria-label="Gestión diaria"><header><small>TOTUSTPV · TU ESTABLECIMIENTO</small><h3>Gestión diaria</h3><p>Todo lo que acompaña a la venta, organizado en un solo lugar.</p></header>${groups.map(([title,description,actions])=>`<section class="tpv-daily-group"><header><h4>${title}</h4><p>${description}</p></header><div class="tpv-action-card-grid">${actions.map(([action,label,description,image,enabled])=>`<button type="button" data-tpv-action="${action}" ${!enabled?'disabled title="Necesita una caja abierta y los permisos correspondientes"':''}><span class="tpv-action-symbol" aria-hidden="true">${workstationIcon(image)}</span><strong>${label}</strong><small>${description}</small></button>`).join('')}</div></section>`).join('')}</section>`;
}
