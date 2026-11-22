import {saleDisplayReference} from './record-identifiers.js?v=8bbe57e845eaa74fec8c407006184fcdfcb11b29';
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
