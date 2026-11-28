import {nativeMicros} from './native-adapter.js?v=577653ec754f9cb45a53fd995da6cfeac146ba3a';
const positive=v=>Number.isSafeInteger(Number(v))&&Number(v)>0;
const rows=(value,key)=>Array.isArray(value)&&value.length===0?[]:value?.[key];
const text=v=>typeof v==='string'&&v.trim()&&v.length<=80&&!/[\x00-\x1f\x7f]/.test(v);
const signed=v=>typeof v==='string'&&v.startsWith('-')?-BigInt(nativeMicros(v.slice(1))):BigInt(nativeMicros(v));
export function unitMeasurePrice({unitTaxInclMicros,unitBaseMicros,conversionRateMicros,basePriceExclMicros,mode}){
 if(!Number.isSafeInteger(unitTaxInclMicros)||unitTaxInclMicros<0||!Number.isInteger(mode)||mode<0||mode>5)throw Error('TPV_UNIT_MEASURE_INVALID');
 const base=BigInt(unitBaseMicros),rate=BigInt(conversionRateMicros),reference=BigInt(basePriceExclMicros);
 if(base<=0n||rate<=0n||reference<=0n)throw Error('TPV_UNIT_MEASURE_INVALID');
 const numerator=BigInt(unitTaxInclMicros)*base*rate,denominator=reference*1000000n,whole=numerator/denominator,remainder=numerator%denominator;
 const up=mode===0?remainder>0n:mode===1?false:remainder*2n>denominator?true:remainder*2n<denominator?false:mode===2?true:mode===3?false:mode===4?whole%2n===1n:whole%2n===0n;
 const amount=whole+(up?1n:0n);if(amount>1000000000000000n)throw Error('TPV_UNIT_MEASURE_INVALID');return Number(amount);
}
/** Snapshot at quotation. It is presentation metadata, never a payable amount.
 * Mirrors the ratio semantics of Product::computeUnitPriceRatio in PS 8.2.
 * Missing metadata must never block a sale or invent an historical unit price. */
export async function captureReceiptUnitMeasures({expected,transport}){
 const out={version:1,items:[],unavailable:false};
 try{
  const ids=[...new Set(expected.lines.map(l=>l.productId))],response=await transport.read('products',{'filter[id]':'['+ids.join('|')+']',display:'[id,unity]',limit:'0,201'}),products=rows(response,'products');
  if(!Array.isArray(products)||products.length>200||new Set(products.map(p=>Number(p.id))).size!==products.length||products.some(p=>!ids.includes(Number(p.id))))throw Error('TPV_UNIT_MEASURE_INVALID');
  if(ids.some(id=>!products.some(p=>Number(p.id)===id)))out.unavailable=true;
  const measured=expected.lines.filter(line=>text(products.find(p=>Number(p.id)===line.productId)?.unity));
  if(!measured.length)return out;
  const currencyRows=rows(await transport.read('currencies',{'filter[id]':`[${expected.currencyId}]`,display:'[id,iso_code,conversion_rate]',limit:'0,2'}),'currencies');
  if(!Array.isArray(currencyRows)||currencyRows.length!==1||Number(currencyRows[0].id)!==expected.currencyId||currencyRows[0].iso_code!=='EUR')throw Error('TPV_UNIT_MEASURE_INVALID');
  const rate=nativeMicros(currencyRows[0].conversion_rate);if(rate<=0)throw Error('TPV_UNIT_MEASURE_INVALID');
  const addressIds=[...new Set([expected.invoiceAddressId,expected.deliveryAddressId])];
  const [customersResponse,addressesResponse]=await Promise.all([
   transport.read('customers',{'filter[id]':`[${expected.customerId}]`,display:'[id,id_default_group]',limit:'0,2'}),
   transport.read('addresses',{'filter[id]':'['+addressIds.join('|')+']',display:'[id,id_customer,id_country,id_state,postcode]',limit:'0,3'})
  ]);
  const customers=rows(customersResponse,'customers'),addresses=rows(addressesResponse,'addresses');
  if(!Array.isArray(customers)||customers.length!==1||Number(customers[0].id)!==expected.customerId||!positive(customers[0].id_default_group)||!Array.isArray(addresses)||addresses.length!==addressIds.length||new Set(addresses.map(a=>Number(a.id))).size!==addresses.length||addresses.some(a=>!addressIds.includes(Number(a.id))||Number(a.id_customer)!==expected.customerId))throw Error('TPV_UNIT_MEASURE_INVALID');
  const address=addresses[0];
  // If tax-address selection would matter, omit rather than choose a country.
  if(!positive(address.id_country)||!Number.isSafeInteger(Number(address.id_state))||Number(address.id_state)<0||typeof address.postcode!=='string'||!/^[A-Za-z0-9 -]{0,12}$/.test(address.postcode)||addresses.some(a=>String(a.id_country)!==String(address.id_country)||String(a.id_state)!==String(address.id_state)||a.postcode!==address.postcode))throw Error('TPV_UNIT_MEASURE_INVALID');
  const priceContext={countryId:Number(address.id_country),stateId:Number(address.id_state),postcode:address.postcode,groupId:Number(customers[0].id_default_group)};
  for(let i=0;i<measured.length;i+=4)await Promise.all(measured.slice(i,i+4).map(async line=>{
   try{
    const basis=await transport.readNativeUnitMeasure({productId:line.productId,attributeId:line.attributeId,quantity:line.qty,currencyId:expected.currencyId,...priceContext});
    if(basis.productId!==line.productId||basis.attributeId!==line.attributeId||!text(basis.unitLabel))throw Error('TPV_UNIT_MEASURE_INVALID');
    let base=signed(basis.unitBaseDecimal);if(line.attributeId)base+=signed(basis.unitImpactDecimal);
    if(base<=0n)return;
    const amount=unitMeasurePrice({unitTaxInclMicros:line.unitTaxInclMicros,unitBaseMicros:base,conversionRateMicros:rate,basePriceExclMicros:nativeMicros(basis.basePriceExclDecimal),mode:expected.nativeRoundMode});
    out.items.push({productId:line.productId,attributeId:line.attributeId,qty:line.qty,unitLabel:basis.unitLabel.trim(),unitPriceMicros:amount});
   }catch{out.unavailable=true;}
  }));
  out.items.sort((a,b)=>a.productId-b.productId||a.attributeId-b.attributeId);
 }catch{out.unavailable=true;}
 return out;
}
export async function withReceiptUnitMeasures({document,expected,orderId,read}){
 const clean={...document,lines:document.lines?.map(({unit_measure,...line})=>line)};
 if(document.kind!=='receipt'||!positive(orderId)||Number(document.order_id)!==orderId||!Array.isArray(clean.lines))return clean;
 const snapshot=expected?.receiptUnitMeasures;
 if(snapshot?.version!==1||!Array.isArray(snapshot.items))return {...clean,unit_measure_unavailable:true};
 try{
  const details=rows(await read('order_details',{'filter[id_order]':`[${orderId}]`,display:'[id,id_order,product_id,product_attribute_id,product_quantity,product_name,product_reference]',limit:'0,201'}),'order_details');
  if(!Array.isArray(details)||details.length!==clean.lines.length||new Set(details.map(d=>Number(d.id))).size!==details.length||details.some(d=>!positive(d.id)||Number(d.id_order)!==orderId||!positive(d.product_id)||!Number.isSafeInteger(Number(d.product_attribute_id))||Number(d.product_attribute_id)<0))throw Error('TPV_UNIT_MEASURE_INVALID');
  return {...clean,unit_measure_unavailable:snapshot.unavailable===true,lines:clean.lines.map(line=>{
   const matches=details.filter(d=>d.product_name===line.name&&(d.product_reference||'')===(line.reference||'')&&Number(d.product_quantity)===line.quantity);
   const candidates=matches.map(d=>snapshot.items.find(s=>s.productId===Number(d.product_id)&&s.attributeId===Number(d.product_attribute_id)&&s.qty===line.quantity));
   if(!candidates.length||candidates.some(c=>!c||!text(c.unitLabel)||!Number.isSafeInteger(c.unitPriceMicros)||c.unitPriceMicros<0)||candidates.some(c=>c.unitLabel!==candidates[0].unitLabel||c.unitPriceMicros!==candidates[0].unitPriceMicros))return line;
   return {...line,unit_measure:{label:candidates[0].unitLabel,price_micros:candidates[0].unitPriceMicros}};
  })};
 }catch{return {...clean,unit_measure_unavailable:true};}
}
