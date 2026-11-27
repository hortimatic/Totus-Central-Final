import {displayPreferences,TPV_VARIANT_ORDERS} from './display-preferences.js?v=91a64b47f29e56e4340588813d9c7efa27cfca45';
import {receiptOptions} from './receipt-options.js?v=91a64b47f29e56e4340588813d9c7efa27cfca45';
import {customerDisplayOptions} from './customer-display.js?v=91a64b47f29e56e4340588813d9c7efa27cfca45';
import {searchPreferences} from './search-preferences.js?v=91a64b47f29e56e4340588813d9c7efa27cfca45';
import {cataloguePreferences} from './catalogue-preferences.js?v=91a64b47f29e56e4340588813d9c7efa27cfca45';

// These are presentation preferences only. Fiscal, permission and payment policies
// deliberately remain with their own authorized services.
const fields={};
const bind=(id,group,key,options=null)=>{fields[id]={group,key,options};};
bind('CFG-01-01','display','beepOnAdd');
bind('CFG-01-02','display','showTaxBreakdown');
bind('CFG-09-01','display','layout',[['balanced','Anchura compartida 50/50'],['catalogue','Más espacio para catálogo'],['ticket','Más espacio para ticket']]);
for(const [id,key] of Object.entries({'04':'ticketNewestFirst','06':'returnToStart','14':'showStock','15':'showReferences'}))bind('CFG-09-'+id,'display',key);
bind('CFG-09-08','display','variantOrder',Object.entries(TPV_VARIANT_ORDERS));
bind('CFG-09-13','display','priceMode',[['gross','Con IVA'],['net','Sin IVA']]);
bind('CFG-06-11','display','requireQuantity');
const receiptFields={'02':'showLogo','04':'dateFormat','05':'title','09':'footer','10':'showCustomer','11':'showCustomerPhone','12':'showCustomerEmail','13':'showAddressComment','14':'showDeliveryAddress','15':'showCustomerCompany','16':'showCustomerExtra','18':'fontSize','19':'fontFamily','20':'showOnlineTickets','21':'showAfterSale','22':'printAfterSale','23':'showOrderReference','24':'showAttributes','25':'showReferences','26':'showLineDiscount','27':'showUnitMeasure','28':'showOriginalPrice','29':'showUnitPrice','30':'showGroupDiscount','31':'showGiftDiscounts','32':'showDiscountedPrices','33':'showPayments','34':'showOperator','35':'showAddress','37':'showWebsite','38':'showLineTax','39':'numberLines','40':'showBarcode','41':'showDiscounts','42':'includeLineDiscountsInTotal','43':'showVouchers','44':'showPaymentReferences'};
for(const [id,key] of Object.entries(receiptFields))bind('CFG-02-'+id,'receipt',key);
bind('UI-CUSTOMER-EXTRA-FIELD','receipt','customerExtraField',[['taxId','NIF / CIF / identificación fiscal'],['company','Empresa de la dirección'],['comment','Información adicional de la dirección']]);
bind('UI-CUSTOMER-EXTRA-LABEL','receipt','customerExtraLabel');fields['UI-CUSTOMER-EXTRA-LABEL'].text=40;
fields['CFG-02-04'].options=[['native','Fecha de la tienda'],['short','Fecha y hora breve'],['long','Fecha y hora completa']];
fields['CFG-02-18'].options=[10,11,12,13,14,15,16].map(n=>[n,String(n)]);
fields['CFG-02-19'].options=[['arial','Arial'],['monospace','Monoespaciada']];
fields['CFG-02-05'].text=80;fields['CFG-02-09'].text=500;
for(const [id,key] of Object.entries({'01':'enabled','02':'showPrices','03':'showCustomer','04':'color','05':'fontSize'}))bind('CFG-11-'+id,'customerDisplay',key);
fields['CFG-11-04'].color=true;
fields['CFG-11-05'].options=[16,18,20,23,26,30,36,40].map(n=>[n,String(n)]);
bind('CFG-09-05','root','initialCategoryId');fields['CFG-09-05'].initialCategory=true;
bind('UI-VIEW-MODE','root','viewMode',[['grid','Fotos'],['compact','Compacta'],['list','Lista'],['table','Tabla']]);
bind('UI-SHOW-PRODUCT-PRICES','display','showPrices');
bind('CFG-09-03','search','numericKeyboard');
bind('CFG-09-09','catalogue','hideUnavailable');
bind('CFG-09-11','catalogue','extraDetails');
bind('CFG-10-03','search','includeDisabledStock');
for(const [id,member] of Object.entries({'04':'reference','05':'ean13','06':'upc','07':'isbn','08':'name'})){bind('CFG-10-'+id,'search','fields');fields['CFG-10-'+id].member=member;}
bind('CFG-10-02','catalogue','excludedCategories');fields['CFG-10-02'].categories=true;
export const REFERENCE_PREFERENCE_FIELDS=Object.freeze(fields);
export function normalizeReferencePreferences(value={}){return {viewMode:['grid','compact','list','table'].includes(value.viewMode)?value.viewMode:'grid',initialCategoryId:Number.isSafeInteger(value.initialCategoryId)&&value.initialCategoryId>=0&&value.initialCategoryId<=2147483647?value.initialCategoryId:0,display:displayPreferences(value.display),receipt:receiptOptions(value.receipt),customerDisplay:customerDisplayOptions(value.customerDisplay),search:searchPreferences(value.search),catalogue:cataloguePreferences(value.catalogue)};}
export function applyReferencePreferences(current,entries){
 const next=normalizeReferencePreferences(current);
 for(const [id,raw] of entries){
  const field=fields[id];if(!field)throw Error('Este ajuste todavía no está conectado.');
  const owner=field.group==='root'?next:next[field.group],before=owner[field.key];let value=raw;
  if(field.initialCategory){if(typeof raw!=='string'||!/^(0|[1-9][0-9]{0,9})$/.test(raw)||Number(raw)>2147483647)throw Error('Selecciona una categoría inicial válida.');next.initialCategoryId=Number(raw);continue;}
  if(field.member){if(!['true','false'].includes(raw))throw Error('Selecciona On u Off.');next.search.fields=next.search.fields.filter(key=>key!==field.member);if(raw==='true')next.search.fields.push(field.member);continue;}
  if(field.categories){if(!Array.isArray(raw)||raw.some(id=>typeof id!=='string'||!/^[1-9][0-9]{0,9}$/.test(id)))throw Error('Selecciona categorías válidas.');next.catalogue.excludedCategories=raw.map(Number);continue;}
  if(typeof before==='boolean'){if(!['true','false'].includes(raw))throw Error('Selecciona On u Off.');value=raw==='true';}
  else if(field.options){if(!field.options.some(([key])=>String(key)===raw))throw Error('Selecciona una opción disponible.');value=typeof before==='number'?Number(raw):raw;}
  else if(field.text){if(typeof raw!=='string'||raw.length>field.text||field.key==='title'&&!raw.trim()||/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(raw))throw Error('Revisa el texto del ticket.');}
  else if(field.color&&!/^#[0-9a-f]{6}$/i.test(raw))throw Error('Selecciona un color válido.');
  owner[field.key]=value;
 }
 return normalizeReferencePreferences(next);
}
