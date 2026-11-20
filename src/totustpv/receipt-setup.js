import {createTicketBranding} from './ticket-branding.js?v=54c1a13a9218e12d6bc9700717c9a107df1b5f2b';
import {createGeneralSetup} from './general-setup.js?v=54c1a13a9218e12d6bc9700717c9a107df1b5f2b';
import {receiptOptions,RECEIPT_DEFAULTS} from './receipt-options.js?v=54c1a13a9218e12d6bc9700717c9a107df1b5f2b';
import {REFERENCE_PREFERENCE_FIELDS} from './reference-preferences.js?v=54c1a13a9218e12d6bc9700717c9a107df1b5f2b';
import {receiptSetupFieldsHtml} from './reference-interface.js?v=54c1a13a9218e12d6bc9700717c9a107df1b5f2b';
import {receiptPreviewHtml} from './documents.js?v=54c1a13a9218e12d6bc9700717c9a107df1b5f2b';
export function receiptSetupSettings(value){const normalized=receiptOptions(value);if(!value||typeof value!=='object'||Object.keys(value).some(k=>!Object.hasOwn(RECEIPT_DEFAULTS,k))||Object.keys(RECEIPT_DEFAULTS).some(k=>!Object.hasOwn(value,k)||value[k]!==normalized[k]))throw Error('Revisa las opciones del ticket.');return normalized;}
export function receiptSetupFromForm(form,current=RECEIPT_DEFAULTS){const next={...current};for(const [id,value] of new FormData(form)){const binding=REFERENCE_PREFERENCE_FIELDS[id];if(binding?.group!=='receipt')throw Error('Campo del ticket no reconocido.');const key=binding.key;next[key]=typeof RECEIPT_DEFAULTS[key]==='boolean'?value==='true':typeof RECEIPT_DEFAULTS[key]==='number'?Number(value):value;}return next;}
export function createReceiptSetup(options){
 let selected=null;
 const branding=createTicketBranding({actor:()=>options.actor()?.id,storage:options.storage||globalThis.localStorage,store:(scope,value)=>options.storeBranding(scope,value),canEdit:options.canConfigure});
 const markup=()=>branding.html().replace('Si no subes uno, se utiliza el logo de la tienda conectada cuando está disponible.','Puedes imprimir sin logo o subir el de este establecimiento.').replaceAll('data-tpv-ticket-logo','data-setup-ticket-logo').replaceAll('data-tpv-form="ticket-branding"','data-setup-ticket-branding').replaceAll('data-tpv-action="ticket-logo-remove"','data-setup-logo-remove').replace('Si no subes uno, se utiliza el logo de la tienda conectada cuando está disponible.','Puedes imprimir sin logo o subir el de este establecimiento.');
 const preview=receipt=>receiptPreviewHtml({...receipt,logoData:branding.logoData()});
 return createGeneralSetup({...options,section:'Ticket',settingsTools:{rpc:'totus_tpv_ticket_setup',gridClass:'tpv-receipt-setup-fields',validate:receiptSetupSettings,fromForm:receiptSetupFromForm,
 fieldsHtml:(receipt,settings)=>receiptSetupFieldsHtml(receipt,{...settings,preview:preview(receipt)}),
 beforeLoad:async drawer=>{selected=drawer;await branding.open(drawer,true);},extraHtml:({disabled=false}={})=>disabled?'<fieldset disabled>'+markup()+'</fieldset>':markup(),hasExtraDraft:()=>branding.hasDraft(),onDispose:()=>branding.reset(),
 changeExtra:async event=>{if(!event.target.matches('[data-setup-ticket-logo]'))return false;const file=event.target.files?.[0];if(file)await branding.change(file);return true;},
 clickExtra:async event=>{if(!event.target.closest('[data-setup-logo-remove]'))return false;branding.remove();return true;},submitExtra:async()=>{const expected=branding.logoData();await branding.save();await branding.open(selected,true);if(branding.logoData()!==expected)throw Error('Otra persona ha cambiado el logo después del guardado. Revisa el logo actual.');},
 onChange:(root,receipt)=>{const target=root.querySelector('[data-receipt-setup-preview]');if(target)target.innerHTML=preview(receipt);}}});
}
