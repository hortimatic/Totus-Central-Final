import {orderNoticeOptions} from './order-notices.js?v=c6aa526e08eb134893f164336b4d8564cf9ef625';
import {signatureOptions} from './signature-options.js?v=c6aa526e08eb134893f164336b4d8564cf9ef625';
import {createGeneralSetup} from './general-setup.js?v=c6aa526e08eb134893f164336b4d8564cf9ef625';
import {returnPolicy} from './return-policy.js?v=c6aa526e08eb134893f164336b4d8564cf9ef625';
import {barcodeOptions,BARCODE_FIELDS} from './barcode-options.js?v=c6aa526e08eb134893f164336b4d8564cf9ef625';
import {budgetOptions} from './budget-options.js?v=c6aa526e08eb134893f164336b4d8564cf9ef625';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const help=(label,text)=>'<details class="tpv-info-help"><summary aria-label="Ayuda: '+esc(label)+'">i</summary><div role="note">'+esc(text)+'</div></details>';
const definitions={
 special:{name:'Funciones especiales',keys:['requireSaleNote','requireQuantity','enabled','acceptanceText','orderAlerts','autoPrintOrders'],validate:value=>{if(typeof value.requireSaleNote!=='boolean'||typeof value.requireQuantity!=='boolean')throw Error('Revisa las reglas de la venta.');const notices=orderNoticeOptions({enabled:value.orderAlerts,autoPrint:value.autoPrintOrders});return {orderAlerts:notices.enabled,autoPrintOrders:notices.autoPrint,requireSaleNote:value.requireSaleNote,requireQuantity:value.requireQuantity,...signatureOptions({enabled:value.enabled,acceptanceText:value.acceptanceText})};},fields:[
 ['orderAlerts','Avisar de pedidos nuevos de esta tienda','boolean','Comprueba pedidos mientras el puesto está abierto. Al activarlo toma los pedidos actuales como punto de partida; el historial anterior no se imprime.'],
 ['autoPrintOrders','Solicitar impresión de pedidos nuevos','boolean','Requiere avisos activos. Utiliza el formato de Ticket de esta caja. Los trabajos dudosos quedan para revisión manual; el navegador no confirma que haya salido papel.'],
 ['requireSaleNote','Pedir una nota antes de cobrar','boolean','La nota queda vinculada a la venta y solo es visible para el equipo. Cancelar conserva el ticket.'],
 ['requireQuantity','Elegir la cantidad al añadir un artículo','boolean','Abre la selección de unidades antes de añadir el artículo. También se comprueba la disponibilidad y la cantidad mínima.'],
 ['enabled','Recoger y conservar la firma de facturas','boolean','Se conserva el PDF original y la copia firmada, ligados a su operación. Las firmas anteriores siguen disponibles aunque desactives esta opción.'],
 ['acceptanceText','Texto de aceptación de la firma','longtext','Mensaje que verá el cliente antes de firmar. Hasta 500 caracteres.']
 ]},
 returns:{name:'Devoluciones',keys:['allowPartial','requireOriginalPayment'],validate:returnPolicy,fields:[
 ['allowPartial','Permitir devoluciones parciales','boolean','Si lo desactivas se devuelven todas las unidades pendientes. Una devolución ya enviada se recupera sin repetir el reintegro.'],
 ['requireOriginalPayment','Reintegrar por los medios de pago originales','boolean','Los pagos mixtos se reparten entre sus medios originales, con céntimos exactos y sin superar lo pendiente. El operador confirma el reintegro efectuado.']
 ]},
 barcodes:{name:'Códigos barras',keys:['field','generatorEnabled'],validate:barcodeOptions,fields:[
 ['field','Campo donde se conserva el código','select','El código queda asociado al artículo o variante en el campo seleccionado. Los códigos existentes se conservan.',Object.entries(BARCODE_FIELDS).map(([key,value])=>[key,value.label])],
 ['generatorEnabled','Permitir generar los códigos que faltan','boolean','Antes de escribir se revisan artículos y variantes sin código. Cada código interno se conserva y los reintentos recuperan el mismo trabajo.']
 ]},
 budgets:{name:'Presupuestos',keys:['enabled','prefix','lastNumber','hidePrices'],validate:value=>{const {revision,...settings}=budgetOptions({...value,revision:0});return settings;},fields:[
 ['enabled','Numeración propia de presupuestos','boolean','Comparte la serie entre las cajas del establecimiento. Los documentos anteriores conservan su referencia.'],
 ['prefix','Prefijo','text','Hasta doce letras, números, guiones o barras.'],
 ['lastNumber','Último número utilizado','number','El siguiente presupuesto utiliza el número siguiente. El contador no puede retroceder.'],
 ['hidePrices','Preparar el documento sin precios','boolean','Oculta los precios impresos; mantiene los importes para consultar y convertir el presupuesto en venta.']
 ]}
};
export function ownedConfigurationValue(section,value){const definition=definitions[section];if(!definition||!value||Object.keys(value).length!==definition.keys.length||definition.keys.some(key=>!Object.hasOwn(value,key)))throw Error('No se ha podido verificar la configuración completa.');return definition.validate(value);}
export function createOwnedTpvSetup(section,options){
 const definition=definitions[section];if(!definition)throw Error('Apartado no admitido.');
 const fieldsHtml=(value,{disabled=false}={})=>'<fieldset '+(disabled?'disabled':'')+'><legend>'+esc(definition.name)+'</legend>'+definition.fields.map(([key,label,type,description,choices])=>{
  const control=type==='boolean'?'<label class="tpv-check"><input type="checkbox" name="'+key+'" '+(value[key]?'checked':'')+'>'+esc(label)+'</label>':'<label>'+esc(label)+(type==='select'?'<select name="'+key+'">'+choices.map(([id,text])=>'<option value="'+esc(id)+'" '+(value[key]===id?'selected':'')+'>'+esc(text)+'</option>').join('')+'</select>':'<input name="'+key+'" value="'+esc(value[key])+'" '+(type==='number'?'inputmode="numeric" pattern="[0-9]+"':type==='longtext'?'maxlength="500"':'maxlength="12"')+(type==='number'?' required':'')+'>')+'</label>';
  return '<div class="tpv-general-field">'+control+help(label,description)+'</div>';
 }).join('')+'</fieldset>';
 return createGeneralSetup({...options,section:definition.name,invoke:(name,args)=>options.invoke(name,name==='totus_tpv_owned_configuration'?{...args,p_section:section}:args),settingsTools:{rpc:'totus_tpv_owned_configuration',gridClass:'tpv-owned-settings-fields',validate:value=>ownedConfigurationValue(section,value),validateResult:(result,id,drawer)=>{if(result.scopeId!==(section==='budgets'?drawer?.storeId:id))throw Error('La respuesta no corresponde a la tienda o caja seleccionada.');},fieldsHtml,fromForm:form=>{const fields=new FormData(form);return Object.fromEntries(definition.fields.map(([key,,type])=>{const raw=fields.get(key);if(type==='number'&&(typeof raw!=='string'||!/^(0|[1-9][0-9]{0,8})$/.test(raw)))throw Error('Introduce el último número como un entero válido.');return [key,type==='boolean'?raw==='on':type==='number'?Number(raw):raw];}));}}});
}
