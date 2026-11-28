import {LOCALIZED_PRODUCT_FIELDS} from './productos-write-contract.js?v=92d388846d3f31a3ccc8592cb3b8b720e23304cd';
import {WEBSITE_CHOICES} from './website-registry.js?v=92d388846d3f31a3ccc8592cb3b8b720e23304cd';
const UUID_RE=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const shops={
 hortimatic:{label:'Hortimatic',slug:'hortimatic',host:'hortimatic.com',words:['hortimatic']},
 newoldsmok:{label:'NewOldSmok',slug:'newoldsmok',host:'newoldsmok.com',words:['newoldsmok','new old smok','new-old-smok']}
};
const slugifyWord=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const resolveShop=key=>{
 if(shops[key])return {...shops[key],hosts:[shops[key].host]};
 const site=WEBSITE_CHOICES.find(s=>s.key===key||s.business_id===key);
 if(site?.origin){
  const rawName=String(site.name||site.label||'').split('·')[0].trim();
  const lower=(rawName+' '+String(site.key||'')).toLowerCase();
  const known=lower.includes('newoldsmok')?shops.newoldsmok:lower.includes('hortimatic')?shops.hortimatic:null;
  try{
   const host=new URL(site.origin).hostname.replace(/^www\./,'');
   if(known)return {...known,host,hosts:[...new Set([known.host,host])]};
   const hostSlug=slugifyWord(host.split('.')[0]),cleanSlug=slugifyWord(rawName)||hostSlug||'tienda';
   return {label:rawName||host,slug:cleanSlug,host,hosts:[host],words:[...new Set([rawName,cleanSlug,hostSlug].filter(Boolean))]};
  }catch{return known?{...known,hosts:[known.host]}:null;}
 }
 if(UUID_RE.test(String(key||'')))return {localOnly:true};
 return null;
};
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
export function adaptStoreText(value,source,target,{slug=false}={}){
 const from=resolveShop(source),to=resolveShop(target);
 if(!from||!to)throw Error('Tienda no reconocida para adaptar textos.');
 if(source===target||from.localOnly||to.localOnly)return String(value??'');
 let result=String(value??'');
 for(const host of from.hosts||[from.host])result=result.replace(new RegExp(escape(host),'gi'),to.host);
 result=result.replace(new RegExp('\\b(?:'+from.words.map(escape).join('|')+')\\b','gi'),slug?(to.slug||slugifyWord(to.label)):to.label);
 return result;
}
// Work on an inert HTML fragment. Never rename an image host while retaining
// another shop's image ID, and never guess where another product's URL points.
export function adaptStoreHTML(value,source,target,{sourceProductId='',targetProductId='',imageMap={},categoryMap={}}={}){
 const from=resolveShop(source),to=resolveShop(target);
 if(!from||!to||from.localOnly||to.localOnly)return {value:String(value??''),unresolved:[]};
 const fromHosts=new Set((from.hosts||[from.host]).map(h=>h.replace(/^www\./,'')));
 const template=document.createElement('template');template.innerHTML=String(value??'');
 const walker=document.createTreeWalker(template.content,NodeFilter.SHOW_TEXT);let node;
 while((node=walker.nextNode()))if(!node.parentElement?.closest('script,style'))node.textContent=adaptStoreText(node.textContent,source,target);
 const unresolved=[];
 for(const element of template.content.querySelectorAll('*')){
  for(const key of ['alt','title','aria-label'])if(element.hasAttribute(key))element.setAttribute(key,adaptStoreText(element.getAttribute(key),source,target));
  for(const key of ['src','href','poster']){
   if(!element.hasAttribute(key))continue;
   const raw=element.getAttribute(key);if(!raw||raw.startsWith('#'))continue;let url;try{url=new URL(raw,'https://'+from.host);}catch{continue;}
   if(!fromHosts.has(url.hostname.replace(/^www\./,'')))continue;
   const image=url.pathname.match(/^\/(\d+)(?:-([a-z_]+))?\/[^/]+\.(jpg|png|webp)$/i)||url.pathname.match(/^\/img\/p\/(?:\d\/)*(\d+)(?:-([a-z_]+))?\.(jpg|png|webp)$/i);
   if(image&&/^[1-9]\d*$/.test(String(imageMap[image[1]]||''))){element.setAttribute(key,'https://'+to.host+'/'+imageMap[image[1]]+'-'+(image[2]||'large_default')+'/product.'+image[3]);continue;}
   if(key==='href'&&['/','/index.php'].includes(url.pathname)&&!url.search){element.setAttribute(key,'https://'+to.host+'/');continue;}
   if(key==='href'&&targetProductId&&sourceProductId&&(url.searchParams.get('controller')==='product'&&url.searchParams.get('id_product')===String(sourceProductId)||new RegExp('^/'+escape(String(sourceProductId))+'-').test(url.pathname))){element.setAttribute(key,'https://'+to.host+'/index.php?controller=product&id_product='+targetProductId);continue;}
   const category=key==='href'?(url.searchParams.get('controller')==='category'?url.searchParams.get('id_category'):url.pathname.match(/^\/(\d+)-[^/.]+$/)?.[1]):null;
   if(category&&/^[1-9]\d*$/.test(String(categoryMap[category]||''))){element.setAttribute(key,'https://'+to.host+'/index.php?controller=category&id_category='+categoryMap[category]);continue;}
   unresolved.push({attribute:key,url:raw,reason:image?'Imagen pendiente de importar':'Enlace interno que necesita correspondencia'});
  }
 }
 return {value:template.innerHTML,unresolved};
}
export function adaptProductTexts(record,source,target,context={}){
 const changes=[],unresolved=[];
 for(const field of LOCALIZED_PRODUCT_FIELDS){
  const value=record[field];if(value===undefined||value===null)continue;
  const adapt=text=>{
   if(['description','description_short'].includes(field)&&/<[a-z][\s\S]*>/i.test(String(text))){const result=adaptStoreHTML(text,source,target,context);unresolved.push(...result.unresolved.map(r=>({...r,field})));return result.value;}
   return adaptStoreText(text,source,target,{slug:field==='link_rewrite'});
  };
  const after=Array.isArray(value)?value.map(t=>({...t,value:adapt(t.value??'')})):adapt(value);
  if(JSON.stringify(after)!==JSON.stringify(value))changes.push({field,before:value,after});
 }
 return {changes,unresolved};
}
