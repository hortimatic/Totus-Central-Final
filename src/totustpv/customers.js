import {customerSettings,configuredCustomerFields,CUSTOMER_FORM_FIELDS} from './customer-settings.js?v=5b0474ba65a8a214c07ea3f8964735c96ba5cd4a';
import {directoryText} from '../contact-directory-core.js?v=5b0474ba65a8a214c07ea3f8964735c96ba5cd4a';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const option=(row,value)=>`<option value="${esc(row.id)}" ${String(row.id)===String(value)?'selected':''}>${esc(directoryText(row.name))}</option>`;
export function createTpvCustomerPanel({adapter,can,onSelect,onStatus,confirmDiscard=async()=>false,settings=()=>customerSettings(),onPrintCard=null}){
 let shown=false,data=null,chosen=null,editing=null,address=false,addressCopy=false,metadata=null,values={},query='',page=0;
 const name=row=>[row.firstname,row.lastname].filter(Boolean).join(' ');
 const reset=()=>{shown=false;data=null;chosen=null;editing=null;address=false;addressCopy=false;metadata=null;values={};query='';page=0;};
 const load=async id=>{data=await adapter().searchCustomers(id?{customerId:id}:{search:query,page});chosen=id?data.items[0]:null;};
 function renderFields(isAddress,flag){
  const required=isAddress?['alias','firstname','lastname','address1','city','id_country',...(flag('need_zip_code')?['postcode']:[]),...(flag('need_identification_number')?['dni']:[]),...(flag('contains_states')?['id_state']:[])]:['firstname','lastname','email'];
  return configuredCustomerFields(settings(),isAddress?'address':'customer',required).map(field=>{
   if(field.type==='country')return `<label>${esc(field.label)}<select name="id_country" data-tpv-client-country required>${[...(metadata?.countries||[])].sort((a,b)=>directoryText(a.name).localeCompare(directoryText(b.name),'es')).map(row=>option(row,values.id_country)).join('')}</select></label>`;
   if(field.type==='state')return `<label>${esc(field.label)}<select name="id_state" ${field.required?'required':''}><option value="${field.required?'':'0'}">${field.required?'Selecciona provincia':'Sin provincia'}</option>${(metadata?.states||[]).map(row=>option(row,values.id_state)).join('')}</select></label>`;
   if(field.type==='textarea')return `<label>${esc(field.label)}<textarea name="${field.key}" maxlength="${field.max}" ${field.required?'required':''}>${esc(values[field.key]??'')}</textarea></label>`;
   return `<label>${esc(field.label)}<input name="${field.key}" type="${field.type||'text'}" value="${esc(values[field.key]??'')}" ${field.required?'required':''} maxlength="${field.max}"></label>`;
  }).join('');
 }
 return {
  reset,hasDraft:()=>!!editing&&Object.keys(values).length>0,
  async open(){shown=true;await load();},
  html(){if(!shown)return '';const country=metadata?.countries.find(row=>String(row.id)===String(values.id_country)),
   flag=key=>['1',1,true].includes(country?.[key]);
   return `<section class="card card-pad tpv-customer-panel" aria-label="Cliente de la venta"><header><h3>Cliente y dirección</h3><button type="button" class="btn secondary" data-tpv-client-action="close">Cerrar</button></header>
   <form data-tpv-client-form="search"><label>Buscar nombre, email o ID<input name="search" type="search" value="${esc(query)}"></label><button class="btn secondary" type="submit">Buscar cliente</button></form>
   <div class="inline-actions"><button type="button" class="btn secondary" data-tpv-client-action="counter">Cliente de mostrador</button>${can('create')?'<button type="button" class="btn secondary" data-tpv-client-action="new">Nuevo cliente</button>':''}</div>
   ${!chosen&&!editing?`<div class="tpv-customer-list">${(data?.items||[]).map(row=>`<button type="button" class="btn secondary" data-tpv-client-id="${row.id}"><strong>${esc(name(row))}</strong>${customerSettings(settings()).extraColumn==='none'?'':`<small>${esc(row[customerSettings(settings()).extraColumn]??'')}</small>`}</button>`).join('')||'<p>No hay clientes para esta búsqueda.</p>'}</div><div class="inline-actions"><button type="button" class="btn secondary" data-tpv-client-action="previous" ${page===0?'disabled':''}>Anterior</button><button type="button" class="btn secondary" data-tpv-client-action="next" ${!data?.has_more?'disabled':''}>Siguiente</button></div>`:''}
   ${chosen&&!editing?`<h4>${esc(name(chosen))}</h4>${customerSettings(settings()).cardEnabled&&onPrintCard?'<button type="button" class="btn secondary" data-tpv-client-action="print-card">Tarjeta de cliente</button>':''}<p>${esc(chosen.email)}</p><div class="inline-actions">${(data.addresses||[]).map(row=>`<div><button type="button" class="btn secondary" data-tpv-client-address="${row.id}">${esc(row.alias)} · ${esc(row.address1)}, ${esc(row.city)}</button>${can('create')?`<button type="button" class="btn secondary" data-tpv-client-edit-address="${row.id}">Corregir dirección</button>`:''}</div>`).join('')||'<p>Necesita una dirección válida para calcular impuestos y facturar.</p>'}</div><div class="inline-actions">${can('edit')?'<button type="button" class="btn secondary" data-tpv-client-action="edit">Editar cliente</button>':''}${can('create')?'<button type="button" class="btn secondary" data-tpv-client-action="new-address">Nueva dirección</button>':''}</div>`:''}
   ${editing?`<form data-tpv-client-form="save"><h4>${address?addressCopy?'Corregir dirección · conservar la anterior':'Nueva dirección':editing.id?'Editar cliente':'Nuevo cliente de mostrador'}</h4><div class="tpv-customer-fields">${renderFields(address,flag)}</div>
   <p class="small muted">${address?'La dirección nueva conserva las utilizadas por pedidos anteriores.':'La ficha se guarda en la tienda seleccionada. Un alta de mostrador no suscribe al cliente a publicidad ni crea credenciales de acceso.'}</p>
   <div class="inline-actions"><button type="button" class="btn secondary" data-tpv-client-action="cancel-edit">Cancelar edición</button><button class="btn primary" type="submit">Guardar y verificar ${address?'dirección':'cliente'}</button></div></form>`:''}</section>`;},
  async click(target){const action=target.dataset.tpvClientAction;
   if(target.dataset.tpvClientEditAddress){const source=data?.addresses.find(row=>row.id===Number(target.dataset.tpvClientEditAddress));
    if(!can('create')||!chosen||!source)throw Error('Selecciona una dirección de este cliente.');
    metadata=await adapter().customerMetadata(source.id_country);address=true;addressCopy=true;editing={};
    values=Object.fromEntries(Object.entries(source).filter(([key])=>key!=='id').map(([key,value])=>[key,String(value??'')]));return true;}
   if(target.dataset.tpvClientId){if(editing&&!await confirmDiscard())return true;editing=null;values={};await load(Number(target.dataset.tpvClientId));return true;}
   if(target.dataset.tpvClientAddress){const id=Number(target.dataset.tpvClientAddress),row=data.addresses.find(row=>row.id===id);
    if(!row||!chosen)throw Error('Selecciona una dirección vigente.');await adapter().setCustomer({id:chosen.id,addressId:id});
    await onSelect({id:chosen.id,addressId:id,name:name(chosen),addressLabel:row.alias});reset();return true;}
   if(!action)return false;
   if(action==='close'||action==='cancel-edit'){if(editing&&Object.keys(values).length&&!await confirmDiscard())return true;shown=action!=='close';editing=null;values={};return true;}
   if(action==='counter'){if(editing)throw Error('Termina la edición del cliente antes de cambiarlo.');await adapter().setCustomer(null);await onSelect(null);reset();return true;}
   if(action==='previous'||action==='next'){page=Math.max(0,page+(action==='next'?1:-1));await load();return true;}
   if(action==='new'||action==='edit'){
    if(!data?.defaults)throw Error('Vuelve a consultar los clientes de la tienda.');
    if(!can(action==='new'?'create':'edit'))throw Error('No tienes permiso para guardar clientes.');
    editing=action==='new'?{}:{...chosen};values=Object.fromEntries(CUSTOMER_FORM_FIELDS.map(({key})=>[key,editing[key]||'']));address=false;return true;}
   if(action==='print-card'){if(!chosen||!onPrintCard||!customerSettings(settings()).cardEnabled)throw Error('Selecciona un cliente para preparar su tarjeta.');await onPrintCard({customerId:chosen.id});return true;}
   if(action==='new-address'){
    if(!can('create')||!chosen)throw Error('Selecciona primero un cliente.');
    metadata=await adapter().customerMetadata(data.defaults.country_id);address=true;addressCopy=false;editing={};
    values={alias:'Principal',firstname:chosen.firstname,lastname:chosen.lastname,company:chosen.company||'',id_country:String(data.defaults.country_id),id_state:'0'};return true;}
   return false;
  },
  input(form){if(form?.dataset.tpvClientForm==='save')values=Object.fromEntries(new FormData(form));},
  async change(target){if(!target.hasAttribute('data-tpv-client-country'))return false;values=Object.fromEntries(new FormData(target.form));
   metadata=await adapter().customerMetadata(Number(values.id_country));values.id_state='0';return true;},
  async submit(form){const kind=form.dataset.tpvClientForm,fields=Object.fromEntries(new FormData(form));
   if(kind==='search'){if(editing&&!await confirmDiscard())return true;query=fields.search.trim();page=0;editing=null;values={};await load();return true;}
   if(kind!=='save')return false;
   values=fields;const creating=address||!editing.id;if(!can(creating?'create':'edit'))throw Error('No tienes permiso para guardar esta ficha.');
   if(address){fields.id_customer=String(chosen.id);fields.id_state||='0';}
   else if(creating)Object.assign(fields,{active:'1',is_guest:'1',newsletter:'0',optin:'0',id_default_group:String(data.defaults.guest_group_id),id_lang:String(data.defaults.language_id)});
   const saved=await adapter().writeCustomer({resource:address?'addresses':'customers',recordId:creating?undefined:editing.id,fields});
   const id=address?chosen.id:Number(saved.record_id);editing=null;address=false;values={};await load(id);onStatus('Ficha guardada y verificada en la tienda. Selecciona la dirección para aplicarla al ticket.');return true;
  }
 };
}
