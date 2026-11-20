// One-time removal of pre-release test data. Never runs on production.
export async function clearFinalLegacyDeviceData({hostname=globalThis.location?.hostname,storage=globalThis.localStorage,indexedDB=globalThis.indexedDB}={}){
 if(hostname!=='totuscentralfinal.totuscode.com')return {skipped:true};
 const marker='totus-final-clean-20261120-v1';if(storage.getItem(marker)==='done')return {skipped:true};
 const prefixes=['totus:tpv:','totus-tpv-order-notices-v1:','totus.directory-source.v1:'];
 const removed=[];for(let i=storage.length-1;i>=0;i--){const key=storage.key(i);if(prefixes.some(p=>key.startsWith(p))||/^totus-(?:products|prices)-(?:views|drafts|backend)/.test(key)){storage.removeItem(key);removed.push(key);}}
 const databases=['totus-product-drafts','totus-tpv-catalogue-v1','totus-tpv-offline-v1','totus-central-catalogue-device-v1'];
 const results=await Promise.all(databases.map(name=>new Promise(resolve=>{if(!indexedDB){resolve(true);return;}const request=indexedDB.deleteDatabase(name);request.onsuccess=()=>resolve(true);request.onerror=()=>resolve(false);request.onblocked=()=>resolve(false);})));
 if(results.every(Boolean))storage.setItem(marker,'done');
 return {removed:removed.length,complete:results.every(Boolean)};
}
