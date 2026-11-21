const fields={products:['name','description','description_short','meta_title','meta_description','meta_keywords','link_rewrite','available_now','available_later','delivery_in_stock','delivery_out_stock'],categories:['name','description','meta_title','meta_description','meta_keywords','link_rewrite'],manufacturers:['description','short_description','meta_title','meta_description','meta_keywords'],suppliers:['description','meta_title','meta_description','meta_keywords'],product_options:['name','public_name'],product_option_values:['name'],product_features:['name'],product_feature_values:['value'],groups:['name'],countries:['name'],order_states:['name'],stock_movement_reasons:['name'],supply_order_states:['name'],cart_rules:['name'],carriers:['delay']};
export const localizedWebsiteResource=resource=>Object.hasOwn(fields,resource);
const validId=value=>/^[1-9]\d{0,14}$/.test(String(value??''));
export function validateWebsiteLanguageContext(context){
 if(!context||!Array.isArray(context.languages)||!context.languages.length||!validId(context.primaryLanguageId))throw Error('Falta comprobar los idiomas de la web.');
 const seen=new Set();for(const row of context.languages){if(!validId(row.id)||seen.has(String(row.id))||typeof row.name!=='string'||row.name.length>128||typeof row.isoCode!=='string'||!/^[a-z]{2,3}(?:-[a-z0-9]{2,8})?$/i.test(row.isoCode)||typeof row.active!=='boolean')throw Error('El inventario de idiomas no es válido.');seen.add(String(row.id));}
 if(!context.languages.some(row=>String(row.id)===String(context.primaryLanguageId)&&row.active))throw Error('El idioma principal no está activo en la web.');
 return context;
}
export function localizeWebsiteSourceRecord(row,resource,context){
 if(!localizedWebsiteResource(resource))return row;
 validateWebsiteLanguageContext(context);
 const allowed=new Set(context.languages.map(lang=>String(lang.id))),primary=String(context.primaryLanguageId),localized={},output={...row};
 delete output.__i18n;
 for(const field of fields[resource]){
  if(!Object.hasOwn(row,field))continue;
  const raw=row[field],entries=Array.isArray(raw)?raw:Array.isArray(raw?.language)?raw.language:null;
  let values;
  if(entries){const seen=new Set();values=entries.map(item=>{const id=String(item?.id??item?.language_id??'');if(!allowed.has(id)||seen.has(id)||typeof item.value!=='string')throw Error('La web devolvió traducciones sin identidad válida en '+field+'.');seen.add(id);return {id,value:item.value};});}
  else if(allowed.size===1&&typeof raw==='string')values=[{id:primary,value:raw}];
  else throw Error('La web no devolvió todos los idiomas de '+field+'. La importación se conserva sin dar este lote por completo.');
  const display=values.find(item=>item.id===primary);if(!display)throw Error('Falta el idioma principal en '+field+'.');
  localized[field]=values;output[field]=display.value;
 }
 output.__i18n={primaryLanguageId:primary,languages:context.languages.map(lang=>({...lang,id:String(lang.id)})),fields:localized};
 return output;
}
export const savedWebsiteTranslations=(source,field)=>Array.isArray(source?.[field])?source[field]:Array.isArray(source?.[field]?.language)?source[field].language:source?.__i18n?.fields?.[field]||null;
