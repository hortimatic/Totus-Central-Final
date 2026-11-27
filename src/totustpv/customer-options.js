import {columnSettingsRow} from '../column-settings.js?v=0ac9bdf9823a82e606d0b184c8d21d7976257675';
import {customerSettings,CUSTOMER_FORM_FIELDS,ADDRESS_FORM_FIELDS} from './customer-settings.js?v=0ac9bdf9823a82e606d0b184c8d21d7976257675';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const need=ok=>{if(!ok)throw Error('Revisa los campos y sus posiciones antes de guardar.');};
const ids=value=>{need(typeof value==='string');const list=value?value.split(','):[];need(list.length<=20&&list.every(id=>/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(id))&&new Set(list.map(id=>id.toLowerCase())).size===list.length);return list;};
export function customerSettingsFormValues(value){
 const s=customerSettings(value),out={'customer-extra-ids':s.extraFields.map(f=>f.id).join(','),'customer-extraColumn':s.extraColumn};
 if(s.cardEnabled)out['customer-cardEnabled']='on';
 for(const group of ['customerFields','addressFields'])s[group].forEach((f,i)=>{out[group+'-'+f.key+'-position']=String(i);if(f.visible)out[group+'-'+f.key+'-visible']='on';});
 for(const f of s.extraFields){const prefix='extra-'+f.id+'-';for(const k of ['label','target','type'])out[prefix+k]=f[k];out[prefix+'options']=f.options.join('\n');if(f.required)out[prefix+'required']='on';}
 return out;
}
export function customerSettingsFromForm(fields,current){
 const s=customerSettings(current);
 const ordered=group=>{const positions=new Set();return s[group].map(f=>{const raw=fields.get(group+'-'+f.key+'-position');need(typeof raw==='string'&&/^(0|[1-9][0-9]?)$/.test(raw));const position=Number(raw);need(position<s[group].length&&!positions.has(position));positions.add(position);return {key:f.key,visible:fields.get(group+'-'+f.key+'-visible')==='on',position};}).sort((a,b)=>a.position-b.position).map(({position,...f})=>f);};
 const value=customerSettings({...s,extraColumn:fields.get('customer-extraColumn'),cardEnabled:fields.get('customer-cardEnabled')==='on',customerFields:ordered('customerFields'),addressFields:ordered('addressFields'),
  extraFields:ids(fields.get('customer-extra-ids')).map(id=>{const prefix='extra-'+id+'-',type=fields.get(prefix+'type'),raw=fields.get(prefix+'options');need(typeof raw==='string');return {id,label:fields.get(prefix+'label'),target:fields.get(prefix+'target'),type,required:fields.get(prefix+'required')==='on',options:type==='select'?raw.split(/\r?\n/).map(v=>v.trim()).filter(Boolean):[]};})});
 const {revision,...settings}=value;return {...settings,expectedRevision:revision};
}
export function customerOptionsHtml(value,canEdit,draft=null){
 const s=customerSettings(value),v=draft??customerSettingsFormValues(s),disabled=!canEdit;
 const fieldGroup=(group,definitions,label)=>`<fieldset data-customer-field-group="${group}"><legend>${label}</legend><div class="tc-column-list">${s[group].map((f,index)=>({f,index,position:Number(v[group+'-'+f.key+'-position']??index)})).sort((a,b)=>a.position-b.position).map(({f,index,position})=>{
  const definition=definitions.find(d=>d.key===f.key),selected=v[group+'-'+f.key+'-visible']==='on';
  return columnSettingsRow({key:f.key,label:definition.label,selected,index:position,count:s[group].length,grip:null,up:null,down:null,
   check:{name:group+'-'+f.key+'-visible',disabled},position:{name:group+'-'+f.key+'-position','data-tpv-customer-position':group,'data-position-before':position,'data-preserve-option-order':'',disabled}})
   +(!selected?`<input type="hidden" name="${group}-${f.key}-position" value="${position}">`:'');
 }).join('')}</div></fieldset>`;
 const extraIds=ids(v['customer-extra-ids']??'');
 return `<section class="card card-pad tpv-customer-settings"><h4>Clientes · este establecimiento</h4><form data-tpv-form="customer-settings">
 <label>Dato adicional en la lista<select name="customer-extraColumn" data-preserve-option-order="" ${disabled?'disabled':''}>${[['none','Ninguno'],['id','Número de cliente'],['email','Email'],['company','Empresa'],['phone','Teléfono'],['phone_mobile','Móvil']].map(([id,label])=>`<option value="${id}" ${v['customer-extraColumn']===id?'selected':''}>${label}</option>`).join('')}</select></label>
 <label class="tpv-check"><input type="checkbox" name="customer-cardEnabled" ${v['customer-cardEnabled']==='on'?'checked':''} ${disabled?'disabled':''}> Habilitar tarjeta de cliente</label>
 <p class="small muted">Elige qué campos aparecen y su posición. Los datos obligatorios para facturar seguirán disponibles. Ocultar un campo conserva su información.</p>
 ${fieldGroup('customerFields',CUSTOMER_FORM_FIELDS,'Ficha del cliente')}${fieldGroup('addressFields',ADDRESS_FORM_FIELDS,'Dirección del cliente')}
 <fieldset><legend>Datos adicionales</legend><p class="small muted">Campos propios del establecimiento para clientes o direcciones. Las opciones de una lista se escriben una por línea.</p>
 <input type="hidden" name="customer-extra-ids" value="${esc(extraIds.join(','))}">
 ${extraIds.map(id=>{const p='extra-'+id+'-';return `<fieldset><legend>${esc(v[p+'label']||'Campo adicional')}</legend><label>Nombre del campo<input name="${p}label" value="${esc(v[p+'label'])}" maxlength="80" required ${disabled?'disabled':''}></label><label>Guardar en<select name="${p}target" ${disabled?'disabled':''}>${[['customer','Cliente'],['address','Dirección']].map(([key,label])=>`<option value="${key}" ${v[p+'target']===key?'selected':''}>${label}</option>`).join('')}</select></label><label>Tipo<select name="${p}type" ${disabled?'disabled':''}>${[['text','Texto'],['select','Lista de opciones']].map(([key,label])=>`<option value="${key}" ${v[p+'type']===key?'selected':''}>${label}</option>`).join('')}</select></label><label>Opciones, una por línea<textarea name="${p}options" maxlength="4000" ${disabled?'disabled':''}>${esc(v[p+'options'])}</textarea></label><label class="tpv-check"><input type="checkbox" name="${p}required" ${v[p+'required']==='on'?'checked':''} ${disabled?'disabled':''}> Obligatorio</label>${canEdit?`<button type="button" class="btn secondary" data-tpv-action="customer-remove-extra" data-customer-extra-id="${id}">Quitar campo</button>`:''}</fieldset>`;}).join('')}
 ${canEdit?`<button type="button" class="btn secondary" data-tpv-action="customer-add-extra" ${extraIds.length>=20?'disabled':''}>Añadir campo</button>`:''}</fieldset>
 <div class="inline-actions">${canEdit?'<button type="submit" class="btn primary">Guardar clientes</button>':''}<button type="button" class="btn secondary" data-tpv-action="refresh-customer-settings">Volver a consultar</button></div></form></section>`;
}
// Swap the occupied position too, so a normal select action never yields an
// ambiguous order. Reuses the common Central field row rather than another editor.
export function changeCustomerFieldPosition(select){
 const group=select.dataset.tpvCustomerPosition,previous=select.dataset.positionBefore,next=select.value,form=select.form;
 if(!form||!['customerFields','addressFields'].includes(group))return false;
 for(const input of form.querySelectorAll('[name]'))if(input!==select&&input.name.startsWith(group+'-')&&input.name.endsWith('-position')&&input.value===next){input.value=previous;if(input.dataset.tpvCustomerPosition)input.dataset.positionBefore=previous;break;}
 select.dataset.positionBefore=next;return true;
}
export function customerSettingsError(error){return Error({TPV_CUSTOMER_SETTINGS_FORBIDDEN:'No tienes permiso para configurar los clientes de este establecimiento.',TPV_CUSTOMER_SETTINGS_STALE:'La configuración de clientes ha cambiado. Vuelve a consultarla antes de guardar.',TPV_CUSTOMER_SETTINGS_INVALID:'Revisa los campos y las opciones de los clientes.'}[error?.code||error?.message]||'No se ha podido consultar o guardar la configuración de clientes. Tus cambios se conservan; vuelve a intentarlo.');}
