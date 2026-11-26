import {productDisplayId} from './record-identifiers.js?v=9c763b3418101f5c614af036a4bdef0ed77cfdf3';
import {WEBSITE_CHOICES,websiteName} from './website-registry.js?v=9c763b3418101f5c614af036a4bdef0ed77cfdf3';
import {textValue,associationIds} from './productos-core.js?v=9c763b3418101f5c614af036a4bdef0ed77cfdf3';
import {csvCell} from './utils.js?v=9c763b3418101f5c614af036a4bdef0ed77cfdf3';
import {compareTableValues} from './table-sort.js?v=9c763b3418101f5c614af036a4bdef0ed77cfdf3';
export const PRODUCT_COLUMNS=Object.freeze([
 ['image','Foto'],['name','Producto'],['id','ID'],['reference','Ref.'],['ean13','EAN'],['brand','Marca'],['supplier','Proveedor'],['category','Categoría'],['store','Tienda'],['cost','Coste neto'],['costVat','Coste +IVA'],['costTotal','Coste total'],['price','PVP neto'],['gross','PVP final'],['margin','Margen %'],['marginTotal','Margen €'],['stock','Stock'],['variants','Variantes'],['active','Estado'],['weight','Peso'],['width','Ancho'],['height','Alto'],['depth','Fondo'],['date_add','Creado'],['creator','Autor'],['date_upd','Actualizado']
]);
export function productColumnHeading(key){
 const lines={cost:['Coste','sin IVA'],costVat:['Coste','con IVA'],costTotal:['Coste','IVA + RE'],price:['PVP','sin IVA'],gross:['PVP','con IVA'],margin:['Margen %','sin IVA'],marginTotal:['Margen €','IVA + RE'],weight:['Peso','kg'],width:['Anchura','cm'],height:['Altura','cm'],depth:['Profundidad','cm'],date_add:['Creado','fecha · hora'],creator:['Autor','de alta'],date_upd:['Actualizado','fecha · hora']};
 return lines[key]||[PRODUCT_COLUMNS.find(c=>c[0]===key)?.[1]||key,''];
}
export const DEFAULT_PRODUCT_COLUMNS=Object.freeze(['image','name','id','reference','ean13','brand','category','store','cost','costVat','costTotal','price','gross','marginTotal','margin','stock','variants','active']);
export function productColumns(value){const valid=new Set(PRODUCT_COLUMNS.map(c=>c[0]));return Array.isArray(value)&&value.includes('name')?[...new Set(value.filter(k=>valid.has(k)))]:[...DEFAULT_PRODUCT_COLUMNS];}
export function catalogProductKey(product,fallbackStore=''){
 return (product.__store||fallbackStore)+'|'+String(product.id);
}
export function productPhoto(item,store){
 if(item?.__central){if(!item.__sourceWebsite)return null;store=item.__sourceWebsite;}

 const id=String(item?.id_default_image||associationIds(item,'images')[0]||'');
 if(!WEBSITE_CHOICES.some(s=>s.key===store))return null;
 return /^[1-9]\d{0,14}$/.test(id)?(WEBSITE_CHOICES.find(s=>s.key===store)?.origin||'')+'/'+id+'-home_default/product.jpg':null;
}
export function productWebUrl(item,store){
 if(item?.__central){store=item.__native?.source_website;item={id:item.__native?.source_id};}
 const id=String(item?.id||'');
 if(!/^[1-9]\d{0,14}$/.test(id)||!WEBSITE_CHOICES.some(s=>s.key===store))return null;
 return (WEBSITE_CHOICES.find(s=>s.key===store)?.origin||'')+'/index.php?controller=product&id_product='+id;
}
export function filterProductCatalog(rows,{query='',category='',brand='',active=''}={}){
 const q=query.trim().toLocaleLowerCase('es');
 const relation=(row,key,current,ids=[])=>{if(!current)return true;const [shop,id]=current.includes('|')?current.split('|'):[null,current];return (!shop||row.__store===shop)&&(String(row[key])===id||ids.includes(id));};
 return rows.filter(r=>(!q||[productDisplayId(r),r.id,r.name,r.reference,r.ean13].map(textValue).join(' ').toLocaleLowerCase('es').includes(q))&&relation(r,'id_category_default',category,associationIds(r,'categories'))&&relation(r,'id_manufacturer',brand)&&(active===''||String(r.active)===active));
}
export function productCatalogCsv(rows,columns,value){
 const cell=csvCell;
 return '\uFEFF'+[columns.map(k=>cell(PRODUCT_COLUMNS.find(c=>c[0]===k)?.[1]||k)).join(';'),...rows.map(r=>columns.map(k=>cell(value(r,k))).join(';'))].join('\r\n');
}
export function sortProductCatalog(rows,{field='date_add',direction='desc'}={},value=(row,key)=>row[key]){
 if(!PRODUCT_COLUMNS.some(([key])=>key===field)||field==='image')return [...rows];
 const read=row=>['date_add','date_upd'].includes(field)?textValue(row[field]):value(row,field);
 return rows.map((row,index)=>({row,index,value:read(row)})).sort((a,b)=>compareTableValues(a.value,b.value,direction)||compareTableValues(productDisplayId(a.row),productDisplayId(b.row),direction)||a.index-b.index).map(item=>item.row);
}

export const PRODUCT_COLUMN_MIN_WIDTH=80;
export const PRODUCT_COLUMN_MAX_WIDTH=640;
export function productColumnDefaultWidth(key){return ({image:88,name:220,id:110,reference:170,ean13:140,brand:140,supplier:150,category:150,store:120,creator:150,date_add:170,date_upd:170,marginTotal:130,active:110,actions:250})[key]||112;}
export function productColumnWidths(value){const keys=new Set([...PRODUCT_COLUMNS.map(([k])=>k),'actions']);return value&&typeof value==='object'&&!Array.isArray(value)?Object.fromEntries(Object.entries(value).filter(([k,v])=>keys.has(k)&&Number.isFinite(v)&&v>=PRODUCT_COLUMN_MIN_WIDTH&&v<=PRODUCT_COLUMN_MAX_WIDTH).map(([k,v])=>[k,Math.round(v)])):{};}
export function moveProductColumn(columns,key,target){const next=productColumns(columns),index=next.indexOf(key);if(index<0||!Number.isInteger(target)||target<0||target>=next.length)return next;next.splice(index,1);next.splice(target,0,key);return next;}
