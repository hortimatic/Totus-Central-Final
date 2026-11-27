import {productPurchaseAmounts} from '../productos-tax.js?v=648f617ef5685fd04b0b71ac5e134c5e8668cc5a';
// Same purchase basis as Products. Profit is per unit before other business expenses.
export function productInformationAmounts(value){
 const numeric=v=>v===null||v===undefined||String(v).trim()===''?null:Number(v);
 const cost=numeric(value?.costNet),vat=numeric(value?.vatRate),re=numeric(value?.surchargeRate);
 const base=Number.isFinite(cost)&&cost>=0?cost:null;
 const purchase=productPurchaseAmounts(base,vat,re);
 const gross=Number.isSafeInteger(value?.priceCents)&&value.priceCents>=0?value.priceCents/100:null;
 const profit=purchase.total!==null&&gross!==null?gross-purchase.total:null;
 return {cost:base,withVat:purchase.withVat,total:purchase.total,profit,marginPct:profit!==null&&gross>0?profit/gross*100:null,vatRate:vat,surchargeRate:re};
}
