import {quantityMillis,quantityNumber} from './quantity-measure.js?v=bb8f497d868456f3291f78bd02caddfdf764be22';
const need=(ok,message='Revisa el formato de las etiquetas de balanza.')=>{if(!ok)throw Error(message);};
const profileKeys=['enabled','prefixes','pluStart','pluLength','weightStart','weightLength','decimals','checkDigit'];
const profile=(enabled,prefixes,pluStart,weightStart)=>Object.freeze({enabled,prefixes:Object.freeze(prefixes),pluStart,pluLength:5,weightStart,weightLength:5,decimals:3,checkDigit:true});
export const SCALE_DEFAULTS=Object.freeze({useUpcAsPlu:false,ean13:profile(false,['20'],2,7),ean14:profile(false,['020'],3,8)});
function checkProfile(value,length){
 need(value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).length===profileKeys.length&&profileKeys.every(key=>Object.hasOwn(value,key)));
 need(typeof value.enabled==='boolean'&&typeof value.checkDigit==='boolean'&&Array.isArray(value.prefixes)&&value.prefixes.length>0&&value.prefixes.length<=10&&new Set(value.prefixes).size===value.prefixes.length);
 need(value.prefixes.every(prefix=>typeof prefix==='string'&&/^[0-9]{1,4}$/.test(prefix)));
 need(['pluStart','pluLength','weightStart','weightLength','decimals'].every(key=>Number.isSafeInteger(value[key])));
 const body=length-(value.checkDigit?1:0),prefixEnd=Math.max(...value.prefixes.map(p=>p.length)),pluEnd=value.pluStart+value.pluLength,weightEnd=value.weightStart+value.weightLength;
 need(value.pluLength>=1&&value.pluLength<=8&&value.weightLength>=1&&value.weightLength<=8&&value.pluStart>=prefixEnd&&value.weightStart>=prefixEnd&&pluEnd<=body&&weightEnd<=body&&(pluEnd<=value.weightStart||weightEnd<=value.pluStart)&&value.decimals>=0&&value.decimals<=3);
 return {...value,prefixes:[...value.prefixes]};
}
export function scaleOptions(value=SCALE_DEFAULTS){
 need(value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).length===3&&['useUpcAsPlu','ean13','ean14'].every(key=>Object.hasOwn(value,key))&&typeof value.useUpcAsPlu==='boolean');
 return {useUpcAsPlu:value.useUpcAsPlu,ean13:checkProfile(value.ean13,13),ean14:checkProfile(value.ean14,14)};
}
export function scaleCheckDigit(body){
 need(typeof body==='string'&&/^[0-9]{12,13}$/.test(body));
 let sum=0,weight=3;for(let i=body.length-1;i>=0;i--,weight=4-weight)sum+=Number(body[i])*weight;
 return String((10-sum%10)%10);
}
export function decodeScaleCode(code,settings=SCALE_DEFAULTS){
 const options=scaleOptions(settings);
 need(typeof code==='string'&&code.length<=64,'El código leído no es válido.');
 const value=code.trim();const format=value.length===13?'ean13':value.length===14?'ean14':null;
 if(!format)return null;
 const p=options[format];if(!p.enabled||!p.prefixes.some(prefix=>value.startsWith(prefix)))return null;
 need(/^[0-9]+$/.test(value),'La etiqueta de balanza debe contener solo dígitos.');
 need(!p.checkDigit||scaleCheckDigit(value.slice(0,-1))===value.at(-1),'El dígito de control de la etiqueta de balanza no es correcto.');
 const plu=value.slice(p.pluStart,p.pluStart+p.pluLength),raw=value.slice(p.weightStart,p.weightStart+p.weightLength);
 const grams=BigInt(raw)*10n**BigInt(3-p.decimals);
 need(grams>0n&&grams<=10000000n,'El peso de la etiqueta debe estar entre 0,001 y 10.000 kg.');
 const milli=Number(grams),qty=quantityNumber(milli);
 return {format,code:value,plu,lookupField:options.useUpcAsPlu?'upc':'reference',identifiers:[...new Set([plu,plu.replace(/^0+/,'')||'0'])],quantityMillis:milli,qty,quantityUnit:'kg'};
}
export function resolveScaleProduct(products,decoded){
 need(decoded&&decoded.quantityUnit==='kg'&&Number.isSafeInteger(decoded.quantityMillis)&&quantityMillis(decoded.qty,'kg')===decoded.quantityMillis,'No se ha podido verificar el peso leído.');
 need(Array.isArray(products)&&['upc','reference'].includes(decoded.lookupField)&&Array.isArray(decoded.identifiers),'No se ha podido verificar el artículo de la balanza.');
 const matches=products.filter(product=>decoded.identifiers.includes(String(product?.[decoded.lookupField]??'')));
 need(matches.length===1,matches.length?'El PLU corresponde a varios artículos o variantes. Corrige su identificación antes de cobrar.':'No hay un artículo con ese PLU en esta tienda.');
 const product=matches[0];
 need(!product.chooseVariant,'La etiqueta debe identificar una variante concreta.');
 need(product.quantityUnit==='kg','Este artículo no está configurado para venderse por kg. No se convertirán sus unidades ni existencias automáticamente.');
 return {product,qty:decoded.qty,quantityMillis:decoded.quantityMillis,quantityUnit:'kg',code:decoded.code,plu:decoded.plu};
}
