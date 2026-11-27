import {PRESTASHOP_RESOURCES} from '../prestashop-readonly.js?v=b4be024f454f6e70cb758fc49dbcbc6edffee4d2';
/** Device copy of an already imported Central catalogue; no remote import,
 * credentials, payment authority or delivery-journal mutations. */
const uuid=value=>typeof value==='string'&&/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(value);
const need=value=>{if(!value)throw Error('La copia local del catálogo requiere una actualización.');};
const canonical=value=>JSON.stringify(value,(_,item)=>item&&typeof item==='object'&&!Array.isArray(item)?Object.fromEntries(Object.entries(item).sort(([a],[b])=>a.localeCompare(b))):item);
const fields=(row,keys)=>Object.fromEntries(keys.filter(key=>row[key]!==undefined).map(key=>[key,structuredClone(row[key])]));
function project(source,scope){
 need(source&&source.connectionId===scope.connectionId&&source.revision===scope.revision&&source.productsComplete===true&&typeof source.store==='string'&&source.store.length<=100&&Array.isArray(source.products)&&source.products.length<=100000);
 need(Number.isSafeInteger(source.readAt)&&source.readAt>0&&Number.isSafeInteger(source.updatedAt??source.readAt)&&(source.updatedAt??source.readAt)>=source.readAt);
 const seen=new Set(),products=source.products.map(row=>{need(row&&row.__store===source.store&&/^[1-9][0-9]{0,14}$/.test(String(row.id))&&!seen.has(String(row.id)));seen.add(String(row.id));return fields(row,[...PRESTASHOP_RESOURCES.products,'__store']);});
 const meta=source.metadata,metadata=meta?{warnings:Array.isArray(meta.warnings)?meta.warnings.filter(value=>typeof value==='string'):[],tax:{}}:null;
 if(metadata){
  for(const [key,resource] of Object.entries({categories:'categories',brands:'manufacturers',suppliers:'suppliers',taxGroups:'tax_rule_groups'})){
   if(Array.isArray(meta[key]))metadata[key]=meta[key].map(row=>fields(row,PRESTASHOP_RESOURCES[resource]||['id','name']));
  }
  for(const [key,resource] of Object.entries({countries:'countries',rules:'tax_rules',taxes:'taxes'}))if(Array.isArray(meta.tax?.[key]))metadata.tax[key]=meta.tax[key].map(row=>fields(row,PRESTASHOP_RESOURCES[resource]));
 }
 const result={store:source.store,connectionId:scope.connectionId,revision:scope.revision,readAt:source.readAt,updatedAt:source.updatedAt??source.readAt,productsComplete:true,products,metadata};
 need(canonical(result).length<=50000000);return result;
}
export function createOfflineSourceStore({scope,indexedDB=globalThis.indexedDB,name='totus-central-catalogue-device-v1',now=Date.now}={}){
 need(scope&&uuid(scope.actorId)&&uuid(scope.connectionId)&&Number.isSafeInteger(scope.revision)&&scope.revision>0&&Number.isSafeInteger(scope.shopId)&&scope.shopId>0);
 const key=JSON.stringify([scope.actorId,scope.connectionId,scope.revision,scope.shopId]);
 const run=deviceSourceStore({indexedDB,name,key});
 return Object.freeze({
  async put(source){const data=project(source,scope);need(data.readAt<=now()&&data.updatedAt<=now());
   return run(true,(store,prior,done)=>{
    if(prior&&(prior.data.readAt>data.readAt||prior.data.readAt===data.readAt&&prior.data.updatedAt>=data.updatedAt)){done(false);return;}
    store.put({key,data,fingerprint:canonical(data)});done(true);
   });
  },
  async get(){return run(false,(_store,row,done)=>{
   if(!row){done(null);return;}need(row.key===key&&row.fingerprint===canonical(row.data));
   const data=project(row.data,scope),age=now()-data.readAt;
   done(age<0||age>86400000?null:data);
  });}
 });
}

function deviceSourceStore({indexedDB,name,key}){
 async function run(write,action){
  need(indexedDB);const db=await new Promise((resolve,reject)=>{
   const request=indexedDB.open(name,1);let blocked=false;
   request.onupgradeneeded=()=>request.result.createObjectStore('sources',{keyPath:'key'});
   request.onerror=()=>reject(Error('No se puede abrir la copia local de Productos.'));
   request.onblocked=()=>{blocked=true;reject(Error('Cierra otras ventanas para preparar la copia local.'));};
   request.onsuccess=()=>{if(blocked){request.result.close();return;}request.result.onversionchange=()=>request.result.close();resolve(request.result);};
  });
  try{return await new Promise((resolve,reject)=>{
   const tx=db.transaction('sources',write?'readwrite':'readonly');let result,failure;
   tx.oncomplete=()=>resolve(result);tx.onerror=()=>{};tx.onabort=()=>reject(failure||Error('No se pudo conservar el catálogo en este dispositivo.'));
   const fail=error=>{failure=error;tx.abort();};
   const store=tx.objectStore('sources'),request=store.get(key);request.onsuccess=()=>{try{action(store,request.result,value=>{result=value;});}catch(error){fail(error);}};
  });}finally{db.close();}
 }
 return run;
}

/** Central-owned data only. Every use is checked against an authorized server revision. */
export function createCentralCatalogueStore({scope,indexedDB=globalThis.indexedDB,name='totus-central-catalogue-device-v1'}={}){
 need(scope&&uuid(scope.actorId)&&uuid(scope.storeId)&&uuid(scope.drawerId));
 const key=JSON.stringify(['central',scope.actorId,scope.storeId,scope.drawerId]),run=deviceSourceStore({indexedDB,name,key});
 const validate=data=>{need(data&&/^[a-f0-9]{32}$/.test(data.revision)&&Array.isArray(data.items)&&data.items.length<=1000000);const seen=new Set();for(const row of data.items){need(row&&uuid(row.id)&&!seen.has(row.id)&&Number.isSafeInteger(row.price_cents)&&row.price_cents>=0&&Number.isSafeInteger(row.tax_basis_points)&&row.tax_basis_points>=0&&Number.isFinite(row.stock));seen.add(row.id);}need(canonical(data).length<=50000000);return data;};
 return Object.freeze({get:()=>run(false,(_store,row,done)=>{if(!row){done(null);return;}need(row.key===key&&row.fingerprint===canonical(row.data));done(validate(row.data));}),put:async source=>{const data=validate(source);return run(true,(store,_prior,done)=>{store.put({key,data,fingerprint:canonical(data)});done(true);});}});
}
