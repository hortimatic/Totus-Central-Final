const positive=v=>Number.isSafeInteger(Number(v))&&Number(v)>0;
const list=(response,key)=>Array.isArray(response)&&!response.length?[]:response?.[key];
const text=v=>typeof v==='string'&&v.length<=2000&&!/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(v)?v:'';
/** Explicitly selected invoice-address field, with current customer-read access. */
export async function readReceiptCustomerExtra({read,orderId,shopId,options,access,order}){
 if(options?.showCustomer!==true||options.showCustomerExtra!==true)return {};
 const field=options.customerExtraField||'taxId',columns={taxId:['vat_number','dni'],company:['company'],comment:['other']}[field];
 if(!columns||access!==true)return {customer_extra_unavailable:true};
 try{
  if(!order){const rows=list(await read('orders',{'filter[id]':`[${orderId}]`,display:'[id,id_shop,id_customer,id_address_invoice]',limit:'0,2'}),'orders');if(!Array.isArray(rows)||rows.length!==1)throw Error('Order unavailable');order=rows[0];}
  if(Number(order.id)!==orderId||Number(order.id_shop)!==shopId||!positive(order.id_customer)||!positive(order.id_address_invoice))throw Error('Order scope mismatch');
  const rows=list(await read('addresses',{'filter[id]':`[${Number(order.id_address_invoice)}]`,display:'[id,id_customer,'+columns.join(',')+']',limit:'0,2'}),'addresses');
  if(!Array.isArray(rows)||rows.length!==1||Number(rows[0].id)!==Number(order.id_address_invoice)||Number(rows[0].id_customer)!==Number(order.id_customer))throw Error('Customer scope mismatch');
  return {customer_extra:{field,value:columns.map(key=>text(rows[0][key])).find(Boolean)||''}};
 }catch(error){
  // A missing optional field must not turn a confirmed sale into a retry.
  if(/^TPV_NATIVE_HTTP_(401|403|404)$/.test(error?.message||'')||['Order unavailable','Order scope mismatch','Customer scope mismatch'].includes(error?.message))return {customer_extra_unavailable:true};
  throw error;
 }
}
