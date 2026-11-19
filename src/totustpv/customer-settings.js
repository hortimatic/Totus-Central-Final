const need=(value,message='Revisa la configuración de clientes.')=>{if(!value)throw Error(message);};
const uuid=v=>typeof v==='string'&&/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(v);
const exact=(value,keys)=>value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).length===keys.length&&Object.keys(value).every(k=>keys.includes(k));
const clean=(value,max)=>{need(typeof value==='string');const text=value.trim();need(text.length>0&&Array.from(text).length<=max&&!/[\u0000-\u001f\u007f\uD800-\uDFFF]/u.test(text));return text;};
export const CUSTOMER_FORM_FIELDS=Object.freeze([
 {key:'firstname',label:'Nombre',max:255},{key:'lastname',label:'Apellidos',max:255},{key:'email',label:'Email',type:'email',max:255},{key:'company',label:'Empresa',max:255},
 {key:'birthday',label:'Fecha de nacimiento',type:'date',max:10,initiallyHidden:true},{key:'website',label:'Web',type:'url',max:255,initiallyHidden:true},
 {key:'siret',label:'Identificación de empresa',max:255,initiallyHidden:true},{key:'ape',label:'Actividad de empresa',max:255,initiallyHidden:true}
].map(Object.freeze));
export const ADDRESS_FORM_FIELDS=Object.freeze([
 {key:'alias',label:'Alias',max:32},{key:'firstname',label:'Nombre',max:255},{key:'lastname',label:'Apellidos',max:255},{key:'company',label:'Empresa',max:255},
 {key:'address1',label:'Dirección',max:128},{key:'address2',label:'Complemento',max:128},{key:'postcode',label:'Código postal',max:12},{key:'city',label:'Ciudad',max:64},
 {key:'phone',label:'Teléfono',type:'tel',max:32},{key:'dni',label:'DNI/NIF',max:16},{key:'vat_number',label:'Identificación fiscal',max:32},
 {key:'id_country',label:'País',type:'country'},{key:'id_state',label:'Provincia',type:'state'},
 {key:'phone_mobile',label:'Móvil',type:'tel',max:32,initiallyHidden:true},{key:'other',label:'Observaciones de la dirección',type:'textarea',max:300,initiallyHidden:true}
].map(Object.freeze));
const defaultFields=fields=>fields.map(field=>({key:field.key,visible:!field.initiallyHidden}));
export function customerSettings(value){
 if(value===undefined)value={revision:0,extraColumn:'email',cardEnabled:false,customerFields:defaultFields(CUSTOMER_FORM_FIELDS),addressFields:defaultFields(ADDRESS_FORM_FIELDS),extraFields:[]};
 need(exact(value,['revision','extraColumn','cardEnabled','customerFields','addressFields','extraFields']));
 need(Number.isSafeInteger(value.revision)&&value.revision>=0&&['none','id','email','company','phone','phone_mobile'].includes(value.extraColumn)&&typeof value.cardEnabled==='boolean');
 const fields=(rows,definitions)=>{need(Array.isArray(rows)&&rows.length===definitions.length);const seen=new Set();return rows.map(row=>{need(exact(row,['key','visible'])&&definitions.some(f=>f.key===row.key)&&!seen.has(row.key)&&typeof row.visible==='boolean');seen.add(row.key);return {...row};});};
 need(Array.isArray(value.extraFields)&&value.extraFields.length<=20);const ids=new Set();
 const extraFields=value.extraFields.map(field=>{
  need(exact(field,['id','label','target','type','required','options'])&&uuid(field.id)&&!ids.has(field.id.toLowerCase())&&['customer','address'].includes(field.target)&&['text','select'].includes(field.type)&&typeof field.required==='boolean');ids.add(field.id.toLowerCase());
  need(Array.isArray(field.options)&&field.options.length<=30);const options=field.options.map(option=>clean(option,120));need(new Set(options).size===options.length&&(field.type==='select'?options.length>0:options.length===0));
  return {...field,label:clean(field.label,80),options};
 });
 return {revision:value.revision,extraColumn:value.extraColumn,cardEnabled:value.cardEnabled,customerFields:fields(value.customerFields,CUSTOMER_FORM_FIELDS),addressFields:fields(value.addressFields,ADDRESS_FORM_FIELDS),extraFields};
}
/** Field visibility affects the form, never the stored native record. Required
 * country/native fields stay available even when a preference hides them. */
export function configuredCustomerFields(settings,target,required=[]){
 const rules=customerSettings(settings),definitions=target==='customer'?CUSTOMER_FORM_FIELDS:target==='address'?ADDRESS_FORM_FIELDS:null;need(definitions);
 need(Array.isArray(required)&&required.every(key=>definitions.some(f=>f.key===key)));
 return rules[target==='customer'?'customerFields':'addressFields'].filter(row=>row.visible||required.includes(row.key)).map(row=>({...definitions.find(f=>f.key===row.key),required:required.includes(row.key)}));
}
/** Extra values are Central metadata, not unsupported fields sent to the
 * existing PrestaShop writer. Stable definition IDs survive label changes. */
export function customerExtraValues(settings,target,input){
 const rules=customerSettings(settings);need(['customer','address'].includes(target));need(input&&typeof input==='object'&&!Array.isArray(input));
 const definitions=rules.extraFields.filter(field=>field.target===target);need(Object.keys(input).every(id=>definitions.some(field=>field.id===id)));
 return Object.fromEntries(definitions.map(field=>{const raw=Object.hasOwn(input,field.id)?input[field.id]:'';need(typeof raw==='string');const value=raw.trim();need(Array.from(value).length<=1000&&!/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f\uD800-\uDFFF]/u.test(value));need(!field.required||value.length>0,'Completa el campo '+field.label+'.');need(field.type!=='select'||!value||field.options.includes(value),'Elige una opción válida en '+field.label+'.');return [field.id,value];}));
}
