import {saleDisplayReference} from './record-identifiers.js?v=c5a5309bfbd15ee77f800dac927a0a6118c1dee1';
const methodNames={cash:'Efectivo',card:'Tarjeta',bizum:'Bizum',transfer:'Transferencia',cheque:'Cheque'};
const decimal=cents=>(Number(cents)/100).toFixed(2);
const localDate=value=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Madrid',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).format(new Date(value));
export function centralSaleRow(sale){
 if(!Number.isSafeInteger(sale.total_cents)||!Number.isSafeInteger(sale.paid_cents)||!Array.isArray(sale.snapshot?.lines)||!Array.isArray(sale.payments))throw Error('Venta de Central incompleta.');
 const methods=[...new Set(sale.payments.map(p=>methodNames[p.method]||p.method))];
 return {id:sale.id,reference:saleDisplayReference(sale),date_add:localDate(sale.created_at),valid:'1',current_state:'Central',
  id_customer:sale.customer_id||'',customer_name:sale.snapshot.customerName||'',currency_code:sale.snapshot.currency==='EUR'?'EUR':null,
  total_paid_tax_incl:decimal(sale.total_cents),total_paid_tax_excl:Number.isSafeInteger(sale.snapshot.productsNetCents)?decimal(sale.snapshot.productsNetCents):'',
  total_shipping_tax_incl:'0.00',total_shipping_tax_excl:'0.00',total_wrapping_tax_excl:'0.00',
  total_discounts_tax_incl:Number.isSafeInteger(sale.snapshot.discountCents)?decimal(sale.snapshot.discountCents):'',
  payment:methods.length>1?'Mixto · '+methods.join(' + '):methods[0]||(sale.on_credit?'Crédito':'Sin cobros registrados'),
  margin_value:null,invoice_number:'0',__centralSale:sale};
}
export function centralSaleLines(sale){return sale.snapshot.lines.map((line,index)=>({id:sale.id+':'+index,id_order:sale.id,product_id:line.productId,
 product_attribute_id:'0',product_name:line.name,product_reference:line.reference||'',product_quantity:line.qty,
 total_price_tax_incl:decimal(line.totalCents),total_price_tax_excl:decimal(line.netCents),unit_price_tax_incl:decimal(line.unitCents),
 tax_rates:[line.taxBasisPoints/100],__quantityUnit:line.quantityUnit||'unit'}));}

// Same cost precedence as Central's native summary: variant, then product.
export function centralSalesMargin(sales,products){
 const costs=new Map();for(const p of products){for(const c of p.catalogue||[]){const v=p.variants?.find(v=>v.id===c.variant_id);const raw=v?.cost_net??p.details?.sourceData?.wholesale_price??p.details?.costNet;const cost=raw!==null&&raw!==undefined&&String(raw).trim()!==''?Number(raw):NaN;costs.set(c.id,Number.isFinite(cost)&&cost>=0?cost:null);}}
 let margin=0,revenue=0,missing=0;
 for(const sale of sales){const lines=sale.snapshot?.lines||[];for(const line of lines){const cost=costs.get(line.productId),qty=Number(line.qty),net=line.netCents;if(cost==null||!Number.isFinite(qty)||qty<0||!Number.isSafeInteger(net)){missing++;continue;}revenue+=net;margin+=net-Math.round(cost*qty*100);}
 for(const refund of (sale.refunds||[]).filter(r=>r.status==='confirmed')){if(refund.total_cents>0&&!refund.lines?.length)missing++;for(const line of refund.lines||[]){const origin=lines.find(l=>l.productId===line.productId),cost=costs.get(line.productId),qty=Number(line.qty);if(!origin||cost==null||!Number.isSafeInteger(line.totalCents)||!Number.isSafeInteger(origin.netCents)||!Number.isSafeInteger(origin.totalCents)||origin.totalCents<=0||!Number.isFinite(qty)||qty<0){missing++;continue;}const net=Math.round(line.totalCents*origin.netCents/origin.totalCents);revenue-=net;margin-=net-Math.round(cost*qty*100);}}}
 return {complete:missing===0,missing,marginCents:margin,revenueCents:revenue,percent:missing===0&&revenue>0?margin/revenue*100:null};
}
