import assert from 'node:assert/strict';import {chromium} from 'playwright';
const origin='http://127.0.0.1:'+String(process.env.AUDIT_PORT||4173);
const browser=await chromium.launch({headless:true});
try{for(const width of [390,1440]){
 const page=await browser.newPage({viewport:{width,height:1000}});await page.goto(origin+'/tests/chat-harness.html');await page.addStyleTag({url:origin+'/src/interface-controls.css'});
 await page.evaluate(async()=>{
  const q=window.nativeCatalogueQA={calls:[],job:null,fail:true};
  window.supabase={createClient:()=>({functions:{invoke:async(name,args)=>{q.calls.push({name,args});if(q.fail){q.fail=false;return {data:{error:'Interrupción ficticia'}};}q.job={...q.job,state:'completed',processed:2};return {data:{ok:true}};}}})};
  const {openNativeWebsiteCatalogue}=await import('../src/website-native-catalogue-ui.js');
  await openNativeWebsiteCatalogue({website:'fiction',name:'Fiction',rpc:async(name,args)=>{q.calls.push({name,args});if(args.p_action==='start')q.job={id:args.p_job,shop_id:args.p_shop,state:'running',phase:'profile',processed:0};return {job:structuredClone(q.job),shops:[{id:7,name:'Fiction shop'}]};}});
 });
 await page.getByRole('button',{name:'Leer precios y combinaciones',exact:true}).click();await page.getByRole('status').filter({hasText:'Interrupción ficticia'}).waitFor();
 await page.getByRole('button',{name:'Continuar preparación',exact:true}).click();await page.getByRole('heading',{name:'Lectura de precios nativos completada',exact:true}).waitFor();
 const calls=await page.evaluate(()=>nativeCatalogueQA.calls);assert.equal(calls.filter(c=>c.args.p_action==='start').length,1);assert.equal(calls.find(c=>c.args.p_action==='start').args.p_shop,7);assert.equal(calls.filter(c=>c.name==='totus-web-sync').length,2);assert.ok(calls.filter(c=>c.name==='totus-web-sync').every(c=>c.args.body.mode==='catalogue'));
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);await page.getByRole('button',{name:'Cerrar',exact:true}).click();assert.equal(await page.locator('dialog').count(),0);await page.close();
}console.log('Isolated native preparation UI: dynamic shop selection, single job, recovery, mode isolation, responsive layout and close passed.');}finally{await browser.close();}
