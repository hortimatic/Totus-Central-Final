import {workstationIcon} from './workstation-visual.js?v=5d275a985481cf0f8e88bd1538042f6b532fe655';
import {REFERENCE_PREFERENCE_FIELDS,normalizeReferencePreferences} from './reference-preferences.js?v=5d275a985481cf0f8e88bd1538042f6b532fe655';
import {REFERENCE_SETTINGS} from './reference-settings-catalogue.js?v=5d275a985481cf0f8e88bd1538042f6b532fe655';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const folderIcon='<svg viewBox="0 0 160 112" aria-hidden="true"><path fill="#277da8" d="M2 15Q2 5 12 5h40l18 14h78q10 0 10 10v67H2z"/><path fill="#c5e2ef" d="M5 29h148v68H5z"/><path fill="#349bd4" d="M0 38q0-9 10-9h140q10 0 10 9v65q0 9-10 9H10q-10 0-10-9z"/></svg>';
export const productIcon='<svg viewBox="0 0 120 120" aria-hidden="true"><path fill="#2e89ba" d="M60 5 111 33 60 62 9 33zM5 42l48 28v47L5 89zm110 0L67 70v47l48-28z"/></svg>';
const fieldHtml=(f,settings,editable,draft,categories)=>{
 f={...f,label:({'CFG-01-02':'Mostrar desglose del IVA','CFG-02-02':'Mostrar logo del establecimiento'}[f.id]||f.label)};
 const binding=REFERENCE_PREFERENCE_FIELDS[f.id];
 if(binding){
  const value=Object.hasOwn(draft,f.id)?draft[f.id]:binding.group==='root'?settings[binding.key]:binding.member?settings[binding.group][binding.key].includes(binding.member):settings[binding.group][binding.key],disabled=editable?'':'disabled';
  const control=binding.initialCategory?`<select name="${f.id}" id="reference-${f.id}" aria-label="${esc(f.label)}" ${disabled}>${[{id:0,label:'Todas las categorías'},...categories.filter(row=>!settings.catalogue.excludedCategories.includes(row.id))].map(row=>`<option value="${row.id}" ${String(row.id)===String(value)?'selected':''}>${esc(row.label||row.name)}</option>`).join('')}</select>`:binding.categories?`<div class="tpv-reference-category-choice"><select multiple name="${f.id}" aria-label="${esc(f.label)}" id="reference-${f.id}" ${disabled}>${categories.map(row=>`<option value="${row.id}" ${Array.isArray(value)&&value.map(String).includes(String(row.id))?'selected':''}>${esc(row.label||row.name)}</option>`).join('')}</select><button type="button" class="btn secondary" data-tpv-action="reference-clear-categories" ${disabled}>Mostrar todas las categorías</button></div>`:binding.options?`<select name="${f.id}" id="reference-${f.id}" aria-label="${esc(f.label)}" ${disabled}>${binding.options.map(([key,label])=>`<option value="${esc(key)}" ${String(key)===String(value)?'selected':''}>${esc(label)}</option>`).join('')}</select>`:binding.text?`<${binding.text>80?'textarea':'input'} name="${f.id}" id="reference-${f.id}" aria-label="${esc(f.label)}" maxlength="${binding.text}" ${binding.text>80?'rows="3"':`value="${esc(value)}"`} ${disabled}>${binding.text>80?esc(value):''}${binding.text>80?'</textarea>':''}`:binding.color?`<input type="color" name="${f.id}" id="reference-${f.id}" value="${esc(value)}" ${disabled}>`:`<div class="tpv-reference-switch" role="group" aria-label="${esc(f.label)}">${[[true,'On'],[false,'Off']].map(([key,label])=>`<label><input type="radio" name="${f.id}" value="${key}" ${String(key)===String(value)?'checked':''} ${disabled}><span>${label}</span></label>`).join('')}</div>`;
  return `<div class="tpv-reference-option"><label for="reference-${f.id}"><span class="tpv-reference-info" aria-hidden="true">i</span>${esc(f.label)}</label>${control}</div>`;
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
  ['Datos del cliente',[10,11,12,13,14,15,16]],
  ['Artículos y columnas',[24,25,26,27,28,29,32,38,39]],
  ['Totales y descuentos',[17,30,31,33,36,41,42,43,44]],
  ['Impresión y documentos',[20,21,22,23,40]]
 ]:sectionGroups[section];
 if(!groups)return fields.map(f=>fieldHtml(f,settings,editable,draft,categories)).join('');
 const used=new Set();const blocks=groups.map(([title,ids],index)=>{const items=fields.filter(f=>ids.includes(Number(f.id.split('-').at(-1))));items.forEach(f=>used.add(f.id));return items.length?`<details class="tpv-settings-group" ${index===0?'open':''}><summary>${esc(title)}<span>${items.length} opciones</span></summary><div>${items.map(f=>fieldHtml(f,settings,editable,draft,categories)).join('')}</div></details>`:'';});
 const other=fields.filter(f=>!used.has(f.id));if(other.length)blocks.unshift(`<div class="tpv-settings-group-extra">${other.map(f=>fieldHtml(f,settings,editable,draft,categories)).join('')}</div>`);
 return blocks.join('');
}
export function referenceSettingsHtml(section='General',{values={},editable=false,draft={},practice=false,preview='',categories=[],connectedHtml='',coveredIds=[],scopeHtml=''}={}){
 const settings=normalizeReferencePreferences(values);
 const original=REFERENCE_SETTINGS.find(g=>g.name===section)||REFERENCE_SETTINGS[0];
 const fields=(section==='Interfaz'?[{id:'UI-VIEW-MODE',label:'Vista del catálogo al iniciar'},...original.fields]:original.fields).filter(f=>!coveredIds.includes(f.id)&&(!connectedHtml||!f.id.startsWith('CFG-13-')));
 const supported=fields.filter(f=>REFERENCE_PREFERENCE_FIELDS[f.id]),pending=fields.filter(f=>!REFERENCE_PREFERENCE_FIELDS[f.id]);
 return `<section class="tpv-reference-settings" aria-label="Configuración de TotusTPV">
 <header><div><small>TOTUSTPV · AJUSTES</small><h3>Configuración</h3></div><button type="button" class="btn secondary" data-tpv-action="sale">Volver al mostrador</button></header>${scopeHtml}
 <div class="tpv-reference-settings-layout"><nav aria-label="Apartados de configuración"><label class="tpv-settings-search">Buscar un ajuste<input type="search" data-tpv-settings-search placeholder="Logo, permisos, stock…" autocomplete="off"></label><p class="tpv-settings-search-status" data-tpv-settings-search-status role="status" hidden></p>${REFERENCE_SETTINGS.map(g=>`<button type="button" class="${g===original?'active':''}" data-tpv-reference-section="${esc(g.name)}" data-tpv-settings-keywords="${esc([g.name,...g.fields.map(f=>f.label)].join(' '))}" aria-current="${g===original?'page':'false'}">${esc(g.name)}</button>`).join('')}</nav>
 <article><header class="tpv-settings-section-head"><h4>${esc(original.name)}</h4><p class="tpv-reference-status">${practice?'Modo práctica · cambios guardados en este navegador.':'Ajustes del puesto seleccionado · sujetos a tus permisos.'}</p></header>
 <div class="tpv-settings-editor"><div class="tpv-settings-fields">
 ${supported.length?`<form data-tpv-form="reference-preferences" class="tpv-settings-card"><header><h5>Presentación y uso</h5><p>Ajusta las opciones de este apartado y guarda los cambios.</p></header>${preferenceGroupsHtml(section,supported,settings,editable,draft,categories)}<footer><button type="submit" class="btn primary" ${!editable?'disabled':''}>Guardar cambios</button></footer></form>`:''}
 ${connectedHtml?`<div class="tpv-reference-connected">${connectedHtml}</div>`:''}
 ${pending.length?`<details class="tpv-settings-card tpv-settings-pending" ${!supported.length&&!connectedHtml?'open':''}><summary>Opciones todavía no disponibles aquí <span>${pending.length}</span></summary><p>${practice?'La práctica no permite configurar las funciones administrativas de una tienda.':'Estas opciones todavía no están conectadas en este puesto.'}</p>${pending.map(f=>fieldHtml(f,settings,false,draft,categories)).join('')}</details>`:''}
 </div>${section==='Ticket'&&preview?`<aside class="tpv-settings-ticket-preview"><h5>Vista previa del ticket</h5><p>Ejemplo de impresión</p>${preview}</aside>`:''}</div></article></div></section>`;
}

export function referenceActionsHtml(live){
 const actions=[['new-product','＋','Nuevo producto','Alta de artículos y variantes','store'],['drafts','▣','Carritos','Recupera un ticket aparcado','cart'],['budgets','▤','Presupuestos','Prepara y convierte propuestas','drawer'],['history','↩','Devoluciones','Localiza la venta y su reintegro','cart'],['history','☷','Pedidos','Consulta ventas y documentos','store'],['session','€','Mi caja','Movimientos, arqueo y cierre','drawer'],['stock','⇄','Stock','Recibe mercancía y revisa unidades','store'],['settings','⚙','Configuración','Todos los ajustes del mostrador','user']];
 return `<section class="tpv-reference-actions" aria-label="Acciones del mostrador"><header><small>TOTUSTPV</small><h3>Todo a mano</h3><p>Elige lo que necesitas y vuelve a tu venta.</p></header><div class="tpv-action-card-grid">${actions.map(([action,icon,label,description,image])=>`<button type="button" data-tpv-action="${action}" ${!live&&['new-product','drafts','budgets','stock'].includes(action)?'disabled title="Necesita una tienda conectada"':''}><span class="tpv-action-symbol" aria-hidden="true">${action==='settings'?'⚙':action==='history'?'↩':workstationIcon(image)}</span><strong>${label}</strong><small>${description}</small></button>`).join('')}</div></section>`;
}
