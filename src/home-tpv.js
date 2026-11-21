import {esc,money} from './utils.js?v=4dc57035565450676e085a82dc11b64980174cf1';
export const nativeTypes=new Set(['home.income','home.expenses','home.result','home.internal','home.gain','home.activity','prestashop.summary','prestashop.orders','prestashop.top','prestashop.quality']);
export function createHomeReader(rpc){
 const cache=new Map();
 return {async read(store,from,to){const key=store+'|'+from+'|'+to;if(!cache.has(key))cache.set(key,rpc('totus_home_tpv_summary',{p_store:store,p_from:from,p_to:to}).then(r=>{if(r?.storeId!==store||r.from!==from||r.to!==to||r.source!=='totustpv')throw Error('Respuesta de otra tienda.');return r;}).catch(e=>{cache.delete(key);throw e;}));return cache.get(key);},clear(){cache.clear();}};
}
export function homeTpvContent(w,read){
 if(!read)return '<p role="status">Consultando TotusTPV…</p>';
 if(read.error)return '<p role="alert">'+esc(read.error)+'</p>';
 const amount=v=>money(v/100),metric=(label,value)=>'<div class="home-ps-metric"><small>'+esc(label)+'</small><strong>'+esc(value)+'</strong></div>';
 const sales=read.salesCents-read.refundCents;
 if(['home.income','home.expenses','home.internal','home.result'].includes(w.type))return metric({'home.income':'Ventas netas de devoluciones','home.expenses':'Gastos contables','home.internal':'Gastos internos','home.result':'Ventas menos gastos'}[w.type],amount(w.type==='home.income'?sales:w.type==='home.result'?sales-read.expense: w.type==='home.expenses'?read.expense:read.internal));
 if(w.type==='home.gain')return metric('Margen estimado',read.marginComplete?amount(read.marginCents):'Faltan costes')+'<details><summary>ⓘ Cómo se calcula</summary><p>Venta sin impuestos menos coste actual del catálogo. Incluye devoluciones. No es beneficio neto.</p></details>';
 if(w.type==='prestashop.top')return (read.top||[]).map(r=>'<div class="summary-row"><span>'+esc(r.name)+'</span><b>'+esc(r.quantity)+'</b></div>').join('')||'<p>Sin productos vendidos.</p>';
 return '<div class="home-ps-metrics">'+metric('Ventas',amount(sales))+metric('Operaciones',String(read.saleCount))+metric('Devoluciones',amount(read.refundCents))+'</div><p>Datos de TotusTPV</p><div>'+((read.series||[]).map(r=>'<div class="summary-row"><span>'+esc(r.date)+'</span><b>'+amount(r.salesCents)+'</b></div>').join('')||'<p>Sin movimientos en este periodo.</p>')+'</div>';
}
