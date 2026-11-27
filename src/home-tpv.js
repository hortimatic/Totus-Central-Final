import {saleDisplayReference} from './record-identifiers.js?v=cf78275988b180a3b2ac6f14281728e24bb0f7bf';
import {esc,money} from './utils.js?v=cf78275988b180a3b2ac6f14281728e24bb0f7bf';
import {expenseCostAmount} from './calculations.js?v=cf78275988b180a3b2ac6f14281728e24bb0f7bf';
import {activityChartHtml} from './dashboard-activity.js?v=cf78275988b180a3b2ac6f14281728e24bb0f7bf';
import {homeDateRange} from './home-period.js?v=cf78275988b180a3b2ac6f14281728e24bb0f7bf';
import {fieldHelp} from './components.js?v=cf78275988b180a3b2ac6f14281728e24bb0f7bf';
export const nativeTypes=new Set(['home.income','home.expenses','home.result','home.internal','home.gain','home.activity','prestashop.summary','prestashop.orders','prestashop.top','prestashop.quality']);
export function createHomeReader(rpc){
 const cache=new Map();
 return {async read(store,from,to,force=false){const key=store+'|'+from+'|'+to;if(force)cache.delete(key);if(!cache.has(key))cache.set(key,rpc('totus_home_tpv_summary',{p_store:store,p_from:from,p_to:to}).then(r=>{if(r?.storeId!==store||r.from!==from||r.to!==to||r.source!=='totustpv')throw Error('Respuesta de otra tienda.');return r;}).catch(e=>{cache.delete(key);throw e;}));return cache.get(key);},clear(){cache.clear();}};
}
const madrid=value=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Madrid',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).format(new Date(value));
/** Adapt the native store ledger to the existing dashboard view contract. */
export function nativeHomeRead(reads,shop,range,sales=[],media=new Map()){
 if(!reads.length||reads.some(r=>!r||r.error))return null;
 const summaries=reads.map(r=>r.native||r),native={series:summaries.flatMap(r=>r.series||[]),top:summaries.flatMap(r=>r.top||[])};
 for(const field of ['salesCents','refundCents','saleCount','refundCount','marginCents'])native[field]=summaries.reduce((n,r)=>n+Number(r[field]||0),0);
 native.marginComplete=summaries.every(r=>r.marginComplete===true);
 const detail=new Map(),rows=[],chartRows=[];
 for(const sale of sales){
  if(sale.store_id&&sale.store_id!==shop)throw Error('Venta de otra tienda.');
  const date=madrid(sale.created_at),snapshot=sale.snapshot||{};
  if(date.slice(0,10)>=range.from&&date.slice(0,10)<=range.to){
   if(!Number.isSafeInteger(sale.total_cents)||!Array.isArray(snapshot.lines))throw Error('Venta incompleta.');
   const methods=[...new Set((sale.payments||[]).map(p=>({cash:'Efectivo',card:'Tarjeta',bizum:'Bizum',transfer:'Transferencia',cheque:'Cheque'}[p.method]||p.method)))];
   const row={id:sale.id,reference:saleDisplayReference(sale),display_number:sale.display_number,date_add:date,valid:'1',id_currency:'EUR',currency_code:'EUR',total_paid_tax_incl:(sale.total_cents/100).toFixed(2),payment:methods.join(' + ')||(sale.on_credit?'Crédito':'Sin cobro'),customer_name:snapshot.customerName||'',employee_name:snapshot.operatorName||'',margin_value:null,current_state:'Confirmada'};
   rows.push(row);chartRows.push(row);
   detail.set(String(sale.id),snapshot.lines.map((l,i)=>({id:sale.id+':'+i,id_order:sale.id,product_id:l.productId,product_attribute_id:l.variantId||'0',name:l.name,product_name:l.name,qty:l.qty,product_quantity:l.qty,image:l.imageUrl||l.image||media.get(String(l.productId))||'',reference:l.reference||'',product_reference:l.reference||'',total_price_tax_incl:(l.totalCents/100).toFixed(2),total_price_tax_excl:(l.netCents/100).toFixed(2)})));
  }
  for(const refund of sale.refunds||[]){const d=madrid(refund.created_at);if(refund.status==='confirmed'&&d.slice(0,10)>=range.from&&d.slice(0,10)<=range.to)chartRows.push({id:'refund-'+refund.id,date_add:d,valid:'1',id_currency:'EUR',total_paid_tax_incl:(-refund.total_cents/100).toFixed(2)});}
 }
 const summaryOrders=reads.flatMap(r=>(r.orders||[]).map(o=>{
  const orderLines=Array.isArray(o.lines)?o.lines.map((l,i)=>({id:o.id+':'+i,id_order:o.id,product_id:l.productId,product_attribute_id:l.attributeId||'0',name:l.name,product_name:l.name,qty:l.qty,product_quantity:l.qty,image:media.get(String(l.productId))||'',reference:l.reference||'',product_reference:l.reference||'',total_price_tax_incl:((Number(l.totalCents||0))/100).toFixed(2),total_price_tax_excl:((Number(l.netCents||0))/100).toFixed(2)})):null;
  if(orderLines)detail.set(String(o.id),orderLines);
  return {id:o.id,reference:o.reference||String(o.id).slice(0,8),display_number:o.display_number??(String(o.reference||'').replace(/^Pedido\s*#/i,'')||String(o.id).slice(0,8)),date_add:madrid(o.date),valid:'1',id_currency:'EUR',currency_code:'EUR',total_paid_tax_incl:(Number(o.total||0)/100).toFixed(2),payment:o.payment||'TotusTPV',customer_name:o.customer_name||'',employee_name:o.employee_name||'',margin_value:null,current_state:'Confirmada'};
 }));
 const seenIds=new Set(rows.map(r=>String(r.id)));
 for(const extra of summaryOrders)if(!seenIds.has(String(extra.id))){rows.push(extra);chartRows.push(extra);seenIds.add(String(extra.id));}
 const total=(native.salesCents-native.refundCents)/100;
 return {shop,rows,chartRows,currencies:new Map([['EUR','EUR']]),detailsByOrder:detail,complete:true,native,nativeStats:{count:native.saleCount,total,ticket:native.saleCount?native.salesCents/100/native.saleCount:null,complete:true},top:native.top.map(p=>({name:p.name,qty:p.quantity,reference:p.reference||'',productId:p.id,attributeId:'0',image:media.get(String(p.id))||''})),totalUnits:native.top.reduce((n,p)=>n+Number(p.quantity),0),...range,checked:new Date().toLocaleString('es-ES')};
}
function nativeFinance(w,data,expenses){
 const reads=Object.values(data||{}),range=homeDateRange(w),expected=w.scope.store==='all'?null:w.scope.store;
 if(!reads.length||reads.some(r=>!r||r.loading))return {pending:true};
 if(reads.some(r=>r.error))return {error:reads.filter(r=>r?.error).map(r=>r.error).join(' · ')};
 const summaries=reads.map(r=>r.native),sales=summaries.reduce((n,r)=>n+r.salesCents-r.refundCents,0);
 const costs=(expenses||[]).filter(e=>(!expected||e.store_id===expected)&&e.expense_date>=range.from&&e.expense_date<=range.to);
 const fiscal=costs.filter(e=>!e.management_only).reduce((n,e)=>n+Math.round(expenseCostAmount(e)*100),0),internal=costs.filter(e=>e.management_only).reduce((n,e)=>n+Math.round(expenseCostAmount(e)*100),0);
 return {sales,fiscal,internal,costs,summaries,range,margin:summaries.reduce((n,r)=>n+r.marginCents,0),marginComplete:summaries.every(r=>r.marginComplete)};
}
export function nativeHomeFinance(w,data,expenses){
 const value=nativeFinance(w,data,expenses);if(value.pending)return '<p role="status">Consultando TotusTPV…</p>';if(value.error)return '<p role="alert">'+esc(value.error)+'</p>';
 const gain=w.type==='home.gain',labels={'home.income':'Ingresos del periodo','home.expenses':'Gastos contables','home.result':'Ingresos menos gastos','home.internal':'Gastos internos','home.gain':'Ganancia de las ventas'},amount={'home.income':value.sales,'home.expenses':value.fiscal,'home.result':value.sales-value.fiscal,'home.internal':value.internal,'home.gain':value.margin}[w.type];
 const explanations={
  'home.income':'Total de ventas confirmadas de TotusTPV, con impuestos, menos devoluciones confirmadas en este periodo. No descuenta gastos ni costes de los productos. No equivale al efectivo disponible en caja.',
  'home.expenses':'Suma de los gastos contables registrados según la fecha del gasto. Excluye los marcados como internos. No depende de si ya están pagados y no representa el coste de los productos vendidos.',
  'home.result':'Ingresos del periodo menos gastos contables. Los gastos internos se muestran aparte y no se restan aquí. Es una diferencia de gestión, no el margen comercial ni el beneficio fiscal.',
  'home.internal':'Suma de los gastos marcados como internos según la fecha del gasto. Se mantienen separados de los gastos contables y del indicador Ingresos menos gastos.',
  'home.gain':'Venta sin impuestos menos coste actual del catálogo, descontando devoluciones. Si falta el coste de algún artículo, se muestra Faltan costes. No descuenta los gastos del negocio ni equivale al beneficio neto.'
 };
 const date=s=>s.split('-').reverse().join('/'),context=' Periodo: '+date(value.range.from)+' al '+date(value.range.to)+'. Ámbito: '+(w.scope.store==='all'?'todas las tiendas seleccionables':'la tienda seleccionada')+'.';
 return '<div class="kpi"><small>'+esc(labels[w.type])+fieldHelp(labels[w.type],explanations[w.type]+context)+'</small><strong>'+esc(gain&&!value.marginComplete?'Faltan costes':money(amount/100))+'</strong></div>';
}
export function nativeHomeActivity(w,data,expenses,stores=[]){
 const value=nativeFinance(w,data,expenses);if(value.pending)return '<p role="status">Consultando actividad…</p>';if(value.error)return '<p role="alert">'+esc(value.error)+'</p>';
 const days=Math.round((Date.parse(value.range.to)-Date.parse(value.range.from))/86400000)+1,monthly=days>93,map=new Map();
 for(let t=Date.parse(value.range.from+'T12:00:00Z');t<=Date.parse(value.range.to+'T12:00:00Z');t+=86400000){const key=new Date(t).toISOString().slice(0,monthly?7:10);if(!map.has(key))map.set(key,{key,sales:0,fiscal:0,internal:0,margin:0});}
 for(const summary of value.summaries)for(const r of summary.series||[]){const p=map.get(r.date.slice(0,monthly?7:10));if(p){p.sales+=r.salesCents/100;if(r.marginComplete!==true||!Number.isFinite(r.marginCents))p.margin=null;else if(p.margin!==null)p.margin+=r.marginCents/100;}}
 for(const row of value.costs){const p=map.get(row.expense_date.slice(0,monthly?7:10));if(p)p[row.management_only?'internal':'fiscal']+=expenseCostAmount(row);}
 const comparisons=[];
 for(const [index,store] of stores.filter(s=>s.active!==false&&Object.hasOwn(data,s.id)).entries()){
  const summary=data[store.id].native,points=new Map([...map.keys()].map(key=>[key,{key,sales:0,margin:0}]));
  for(const r of summary.series||[]){const p=points.get(r.date.slice(0,monthly?7:10));if(p){p.sales+=r.salesCents/100;if(r.marginComplete!==true||!Number.isFinite(r.marginCents))p.margin=null;else if(p.margin!==null)p.margin+=r.marginCents/100;}}
  for(const [offset,field,label] of [[0,'sales','Ventas'],[25,'margin','Ganancia']])comparisons.push({key:'store-'+index+'-'+field,label:label+' · '+store.name,color:'hsl('+((index*137+195+offset)%360)+' 65% 42%)',points:[...points.values()],valueKey:field,group:store.name});
 }
 return '<div class="home-activity-margin">'+nativeHomeFinance({...w,type:'home.gain'},data,expenses)+'<button type="button" class="btn secondary" data-home-command="fetch" data-id="'+esc(w.id)+'">Actualizar margen</button></div>'+activityChartHtml({points:[...map.values()],monthly,includeMargin:true},{comparisons}).replace(/<p class="small muted">[\s\S]*?<\/p>/,fieldHelp('Actividad de tus tiendas','Ventas confirmadas de TotusTPV menos devoluciones y gastos registrados de la tienda y periodo seleccionados. La línea rosa representa la ganancia comercial sin impuestos menos coste de producto; no descuenta gastos generales. Los días sin costes completos quedan sin trazar, nunca se convierten en cero. Ingresos menos gastos es una cifra diferente.')); 
}
export function homeTpvContent(w,read){
 if(!read)return '<p role="status">Consultando TotusTPV…</p>';
 if(read.error)return '<p role="alert">'+esc(read.error)+'</p>';
 const amount=v=>money(v/100),metric=(label,value)=>'<div class="home-ps-metric"><small>'+esc(label)+'</small><strong>'+esc(value)+'</strong></div>';
 const sales=read.salesCents-read.refundCents;
 if(['home.income','home.expenses','home.internal','home.result'].includes(w.type))return '<div class="kpi">'+metric({'home.income':'Ventas netas de devoluciones','home.expenses':'Gastos contables','home.internal':'Gastos internos','home.result':'Ventas menos gastos'}[w.type],amount(w.type==='home.income'?sales:w.type==='home.result'?sales-read.expense: w.type==='home.expenses'?read.expense:read.internal))+'</div>';
 if(w.type==='home.gain')return metric('Margen estimado',read.marginComplete?amount(read.marginCents):'Faltan costes')+'<details class="field-help"><summary aria-label="Cómo se calcula">ⓘ</summary><span role="note"><strong>Margen estimado</strong>Venta sin impuestos menos coste actual del catálogo. Incluye devoluciones. No es beneficio neto.</span></details>';
 if(w.type==='prestashop.top')return (read.top||[]).map(r=>'<div class="summary-row"><span>'+esc(r.name)+'</span><b>'+esc(r.quantity)+'</b></div>').join('')||'<p>Sin productos vendidos.</p>';
 if(w.type==='prestashop.quality')return metric('Productos',String(read.products))+metric('Sin código',String(read.missingCodes));
 if(w.type==='prestashop.orders')return (read.orders||[]).map(r=>'<div class="summary-row"><span>'+esc(r.date)+'<small>'+esc(r.id)+'</small></span><b>'+amount(r.total)+'</b></div>').join('')||'<p>Sin ventas en este periodo.</p>';
 const daily=new Map();for(const r of read.series||[])daily.set(r.date,(daily.get(r.date)||0)+r.salesCents);
 const max=Math.max(1,...daily.values());
 return '<div class="home-ps-metrics">'+metric('Ventas',amount(sales))+metric('Operaciones',String(read.saleCount))+metric('Ticket medio',amount(read.saleCount?read.salesCents/read.saleCount:0))+'</div><div class="home-native-chart">'+[...daily].map(([d,v])=>'<div><span>'+esc(d)+'</span><i style="width:'+Math.max(1,v/max*100)+'%"></i><b>'+amount(v)+'</b></div>').join('')+'</div>';
}
