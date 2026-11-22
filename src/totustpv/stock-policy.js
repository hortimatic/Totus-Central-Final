const need=(ok,message)=>{if(!ok)throw Error(message);};
export function stockPolicy(value){
 if(value===undefined)return {allowOutOfStock:false};
 need(value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).every(key=>['allowOutOfStock','allowInactive'].includes(key))&&
  ['allowOutOfStock','allowInactive'].every(key=>value[key]===undefined||typeof value[key]==='boolean'),'Revisa la política de existencias.');
 return {allowOutOfStock:value.allowOutOfStock===true,...(Object.hasOwn(value,'allowInactive')?{allowInactive:value.allowInactive===true}:{})};
}
export function canSellProduct(product,policy){return product?.saleEnabled!==false||product?.localTpv===true&&policy?.allowInactive===true;}
export function canExceedStock(product,policy){return policy?.allowOutOfStock===true&&product?.allowOutOfStock===true;}
export function stockWarning(line){
 if(!Number.isSafeInteger(line?.stock)||!Number.isSafeInteger(line?.qty)||line.qty<=line.stock)return '';
 return `Existencias insuficientes: ${line.qty} en el ticket y ${line.stock} disponibles. Revisa las unidades antes de cobrar.`;
}
export function stockPolicyFromForm(fields,{central=false}={}){return {allowOutOfStock:fields.get('allowOutOfStock')==='on',...(central?{allowInactive:fields.get('allowInactive')==='on'}:{})};}
export function stockPolicyHtml(value,canEdit,{central=false}={}){const policy=stockPolicy(value);return `<fieldset class="tpv-stock-policy"><legend>Ventas y existencias</legend><label class="tpv-check"><input type="checkbox" name="allowOutOfStock" ${policy.allowOutOfStock?'checked':''} ${canEdit?'':'disabled'}> Permitir vender con existencias insuficientes</label>${central?`<label class="tpv-check"><input type="checkbox" name="allowInactive" ${policy.allowInactive?'checked':''} ${canEdit?'':'disabled'}> Permitir vender productos desactivados en la web</label>`:''}<p class="small muted">Se aplica solo a este TPV y no cambia las restricciones de la tienda online. La venta sin stock deja las existencias en negativo: si hay 0 y vendes 2, quedan −2.</p></fieldset>`;}
