export function lineOptions(value){
 if(value===undefined)return {allowPriceChanges:false,requireSaleNote:false,allowNameChanges:false};
 if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).some(key=>!['allowPriceChanges','requireSaleNote','allowNameChanges'].includes(key))||
  Object.values(value).some(item=>typeof item!=='boolean'))throw Error('Revisa las opciones del ticket.');
 return {allowPriceChanges:value.allowPriceChanges===true,requireSaleNote:value.requireSaleNote===true,allowNameChanges:value.allowNameChanges===true};
}
export const lineOptionsFromForm=fields=>({allowPriceChanges:fields.get('allowPriceChanges')==='on',requireSaleNote:fields.get('requireSaleNote')==='on',allowNameChanges:fields.get('allowNameChanges')==='on'});
export function lineOptionsHtml(value,canEdit,{showPrice=true,showName=true,showNote=true}={}){
 const options=lineOptions(value),hidden=key=>`<input type="hidden" name="${key}" value="${options[key]?'on':'off'}">`,check=(key,label)=>`<label class="tpv-check"><input type="checkbox" name="${key}" ${options[key]?'checked':''} ${canEdit?'':'disabled'}> ${label}</label>`;
 return `<fieldset><legend>Opciones del ticket</legend>
 ${showPrice?check('allowPriceChanges','Permitir fijar el precio de un artículo en este ticket')+'<p class="small muted">Requiere permiso para editar ventas. El precio del catálogo se conserva.</p>':hidden('allowPriceChanges')}
 ${showName?check('allowNameChanges','Permitir cambiar el nombre de un artículo en esta venta')+'<p class="small muted">El nombre del catálogo se conserva.</p>':hidden('allowNameChanges')}
 ${showNote?check('requireSaleNote','Pedir una nota interna antes de cobrar')+'<p class="small muted">La nota se guarda en el pedido y solo es visible para el equipo.</p>':hidden('requireSaleNote')}
 </fieldset>`;
}
export function lineAdjustment(value){
 if(value===undefined)return undefined;
 const valid=value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).length===2&&Object.keys(value).every(key=>['kind','value'].includes(key))&&
  ['percent','amount','price'].includes(value.kind)&&Number.isSafeInteger(value.value)&&value.value>0&&value.value<=100000000000&&
  (value.kind!=='percent'||value.value<10000)&&(value.kind!=='price'||value.value<=999999999);
 if(!valid)throw Error('TPV_LINE_ADJUSTMENT_INVALID');return {kind:value.kind,value:value.value};
}
