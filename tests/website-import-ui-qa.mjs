import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true});
try{for(const width of [390,1440]){
 const page=await browser.newPage({viewport:{width,height:1000}});
 await page.goto('http://127.0.0.1:4173/tests/chat-harness.html');
 await page.addStyleTag({url:'http://127.0.0.1:4173/src/appearance.css'});
 await page.addStyleTag({url:'http://127.0.0.1:4173/src/interface-controls.css'});
 await page.evaluate(async()=>{
  const q=window.importQA={calls:[],fail:true,job:null,registry:{websites:[{key:'shop-a',connection_id:'connection',name:'Fiction',status:'active',include_in_totals:false,revision:1,business_id:null}],businesses:[{id:'store-a',name:'Fiction store'}]}};
  window.supabase={createClient:()=>({functions:{invoke:async()=>{if(q.fail){q.fail=false;return {data:{error:'Interrupción ficticia'}};}q.job={...q.job,state:'completed',resource_index:2,imported:1,progress:{products:1}};return {data:{ok:true}};}}})};
  const {openWebsiteImport}=await import('../src/website-import-ui.js');
  await openWebsiteImport({website:'shop-a',name:'Fiction',resources:[{name:'products',readable:true}],rpc:async(name,args)=>{q.calls.push({name,args:structuredClone(args)});if(name==='totus_websites'){if(args.p_action==='save')q.registry.websites[0]={...q.registry.websites[0],...args.p_data,revision:2};return structuredClone(q.registry);}if(args.p_action==='start')q.job={id:args.p_job,state:'running',resource_index:1,resources:args.p_resources,imported:0,progress:{}};return {job:structuredClone(q.job),counts:{}};}});
 });
 await page.locator('[data-import-store]').selectOption('store-a');await page.getByRole('button',{name:'Guardar correspondencia',exact:true}).click();await page.getByText('Correspondencia guardada.',{exact:true}).waitFor();
 await page.getByRole('button',{name:'Iniciar importación',exact:true}).click();await page.getByText('Interrupción ficticia',{exact:true}).waitFor();
 await page.getByRole('button',{name:'Continuar importación',exact:true}).click();await page.getByRole('heading',{name:'Lectura y guardado de recursos completados',exact:true}).waitFor();
 const calls=await page.evaluate(()=>importQA.calls);assert.equal(calls.filter(c=>c.args.p_action==='start').length,1,'resume keeps the original job');assert.equal(calls.find(c=>c.args.p_action==='save').args.p_data.business_id,'store-a');assert.deepEqual(calls.find(c=>c.args.p_action==='start').args.p_resources,['products']);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'fits '+width);await page.getByRole('button',{name:'Cerrar',exact:true}).click();assert.equal(await page.locator('dialog').count(),0);await page.close();
}console.log('Website import UI: store mapping, resource selection, interrupted request/resume without another job, close and responsive layout. Simulated only.');}finally{await browser.close();}
