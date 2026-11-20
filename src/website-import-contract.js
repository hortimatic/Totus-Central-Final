// Resources are explicit: never import authentication configuration or passwords.
export const WEBSITE_IMPORT_GROUPS=Object.freeze([
 {key:'catalogue',name:'Catálogo, SEO y relaciones',resources:['languages','categories','manufacturers','suppliers','product_options','product_option_values','product_features','product_feature_values','tags','products','combinations','product_suppliers','specific_prices','specific_price_rules','image_types']},
 {key:'stock',name:'Existencias y almacenes',resources:['shops','shop_groups','stores','stock_availables','warehouses','warehouse_product_locations','stocks','stock_movement_reasons','stock_movements','supply_order_states','supply_orders','supply_order_details','supply_order_histories','supply_order_receipt_histories']},
 {key:'customers',name:'Clientes, grupos y direcciones',resources:['customers','groups','addresses','countries','states']},
 {key:'history',name:'Histórico de pedidos, cobros y documentos fiscales',resources:['currencies','taxes','tax_rule_groups','tax_rules','carriers','cart_rules','orders','order_details','order_histories','order_states','order_payments','order_invoices','order_slip','order_carriers','order_cart_rules','deliveries']}
]);
export const WEBSITE_IMPORT_RESOURCES=Object.freeze([...new Set(WEBSITE_IMPORT_GROUPS.flatMap(g=>g.resources))]);
const forbidden=/^(?:passwd|password|secure_key|reset_password_token|reset_password_validity|token|secret|api_key|authorization|cookie|card_number|card_expiration|card_holder|cvv|cvc)$/i;
export function safeImportedRecord(value,depth=0){
 if(depth>24)throw Error('El registro tiene una estructura demasiado profunda.');
 if(Array.isArray(value))return value.map(v=>safeImportedRecord(v,depth+1));
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).filter(([key])=>!forbidden.test(key)&&!['__proto__','constructor','prototype'].includes(key)).map(([key,v])=>[key,safeImportedRecord(v,depth+1)]));
 return value;
}
export function importBatchRows(body,resource,cursor,pageSize){
 if(!WEBSITE_IMPORT_RESOURCES.includes(resource))throw Error('Recurso no admitido para importar.');
 const rows=Array.isArray(body?.[resource])?body[resource]:body?.[resource]===''||body?.[resource]==null&&body&&Object.keys(body).length===0?[]:null;
 if(!rows||rows.length>pageSize)throw Error('Respuesta incompleta del recurso '+resource+'.');
 let previous=BigInt(cursor||'0');
 return rows.map(row=>{const id=String(row?.id||'');if(!/^[1-9]\d{0,14}$/.test(id)||BigInt(id)<=previous)throw Error('La API no ha respetado el orden del recurso '+resource+'.');previous=BigInt(id);return safeImportedRecord({...row,id});});
}
