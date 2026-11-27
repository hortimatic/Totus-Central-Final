import {WEBSITE_CHOICES} from './website-registry.js?v=fa92926d3e3c3f2671659fd9e62b3b221d107ffa';
import {PRESTASHOP_QUERY_RECIPES} from './prestashop-queries.js?v=fa92926d3e3c3f2671659fd9e62b3b221d107ffa';
const date=s=>/^\d{4}-\d{2}-\d{2}$/.test(s)&&new Date(s+'T12:00:00Z').toISOString().slice(0,10)===s;
export function validatePrestashopFlow(raw,stores=WEBSITE_CHOICES){
 const flow={id:String(raw.id||''),name:String(raw.name||'').trim(),store:raw.store,recipe:raw.recipe,period:raw.period,start:raw.start||'00:00',end:raw.end||'23:59'};
 if(!/^[a-zA-Z0-9-]{1,80}$/.test(flow.id)||flow.name.length<3||flow.name.length>100||!stores.some(s=>(typeof s==='string'?s:s.key)===flow.store)||!PRESTASHOP_QUERY_RECIPES.some(q=>q.id===flow.recipe&&q.target)||!['today','week','month'].includes(flow.period)||![flow.start,flow.end].every(s=>/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(s)))throw Error('Revisa el nombre, la tienda, la consulta, el periodo y las horas del flujo.');
 return flow;
}
export function prestashopFlowRange(flow,today,stores=WEBSITE_CHOICES){
 validatePrestashopFlow(flow,stores);if(!date(today))throw Error('Fecha de consulta no válida.');
 const d=new Date(today+'T12:00:00Z');if(flow.period==='week')d.setUTCDate(d.getUTCDate()-6);if(flow.period==='month')d.setUTCDate(1);
 return {from:d.toISOString().slice(0,10),to:today,start:flow.start,end:flow.end,daily:flow.recipe==='sales_window'};
}
export function prestashopFlowStore(storage,owner,stores=WEBSITE_CHOICES){
 if(!owner)throw Error('Inicia sesión para guardar tus flujos.');
 const key='totus:prestashop:flows:v1:'+String(owner);
 return {
  read(){const raw=storage.getItem(key);if(!raw)return [];if(raw.length>100000)throw Error('La configuración de flujos necesita revisión.');const rows=JSON.parse(raw);if(!Array.isArray(rows)||rows.length>100)throw Error('La configuración de flujos no es válida.');const active=rows.filter(f=>stores.some(s=>(typeof s==='string'?s:s.key)===f.store));const valid=active.map(f=>validatePrestashopFlow(f,stores));if(valid.length!==rows.length)storage.setItem(key,JSON.stringify(valid));return valid;},
  write(rows){if(!Array.isArray(rows)||rows.length>100)throw Error('Exporta o retira flujos antes de añadir más.');const valid=rows.map(f=>validatePrestashopFlow(f,stores));if(new Set(valid.map(f=>f.id)).size!==valid.length)throw Error('Hay flujos duplicados.');storage.setItem(key,JSON.stringify(valid));return valid;}
 };
}
