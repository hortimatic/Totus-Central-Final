// Presentation identifiers never replace storage keys or website mappings.
export function productDisplayId(product){
 const source=product?.__sourceProductId??product?.source_id??product?.__native?.source_id;
 if(/^[1-9]\d*$/.test(String(source??'')))return String(source);
 const number=product?.display_number??product?.__native?.display_number;
 if(/^[1-9]\d*$/.test(String(number??'')))return 'P-'+String(number).padStart(6,'0');
 return /^[1-9]\d*$/.test(String(product?.id??''))?String(product.id):'Sin numeración';
}
export function saleDisplayReference(sale){
 const value=sale?.reference||sale?.ticket_number?.label||sale?.document?.reference;
 return typeof value==='string'&&value.trim()?value:'Sin numeración';
}
