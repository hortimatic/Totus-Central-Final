import {productPurchaseAmounts} from '../productos-tax.js?v=2ee1bb7846d51e25ababf814bd5aefb08b5233a9';
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
