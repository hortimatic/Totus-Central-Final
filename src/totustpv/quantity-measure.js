const units=Object.freeze({unit:'unidades',kg:'kg',l:'l',m:'m'});
export const TPV_QUANTITY_UNITS=units;
const need=(ok,message='Indica una cantidad válida con hasta tres decimales.')=>{if(!ok)throw Error(message);};
export function quantityMillis(value,unit='unit',{allowZero=false,max=10000}={}){
 need(Object.hasOwn(units,unit)&&typeof allowZero==='boolean'&&Number.isFinite(max)&&max>0);
 need(typeof value==='number'||typeof value==='string');
 const raw=String(value).trim().replace(',','.');
 need(/^(0|[1-9][0-9]{0,8})(?:\.[0-9]{1,9})?$/.test(raw));
 const [whole,fraction='']=raw.split('.');need(!/[1-9]/.test(fraction.slice(3)));
 const milli=Number(whole)*1000+Number(fraction.slice(0,3).padEnd(3,'0'));
 need(Number.isSafeInteger(milli)&&milli>=(allowZero?0:1)&&milli<=max*1000);
 need(unit!=='unit'||milli%1000===0,'Este artículo se vende por unidades enteras.');
 return milli;
}
export function quantityDecimal(milli){
 need(Number.isSafeInteger(milli)&&milli>=0&&milli<=999999999999);
 const whole=Math.floor(milli/1000),part=String(milli%1000).padStart(3,'0').replace(/0+$/,'');
 return String(whole)+(part?'.'+part:'');
}
export const quantityNumber=milli=>Number(quantityDecimal(milli));
export function addQuantities(a,b,unit='unit',options={}){
 const total=quantityMillis(a,unit,{...options,allowZero:true})+quantityMillis(b,unit,{...options,allowZero:true});need(total<=(options.max??10000)*1000);return quantityNumber(total);
}
export function measuredLineCents(unitCents,milli){
 need(Number.isSafeInteger(unitCents)&&unitCents>=0&&unitCents<=999999999&&Number.isSafeInteger(milli)&&milli>0&&milli<=10000000);
 const result=(BigInt(unitCents)*BigInt(milli)+500n)/1000n;
 need(result<=999999999n,'El importe de la línea supera el máximo permitido.');
 return Number(result);
}
export function quantityLabel(value,unit='unit'){
 const milli=quantityMillis(value,unit,{allowZero:true,max:999999999.999});
 return new Intl.NumberFormat('es-ES',{maximumFractionDigits:3}).format(quantityNumber(milli))+' '+units[unit];
}
