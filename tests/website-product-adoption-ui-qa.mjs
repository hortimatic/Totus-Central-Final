import assert from 'node:assert/strict';import {chromium} from 'playwright';
const origin='http://127.0.0.1:'+String(process.env.AUDIT_PORT||4173),browser=await chromium.launch({headless:true});
try{for(const width of [390,1440]){
 const page=await browser.newPage({viewport:{width,height:1000}});await page.goto(origin+'/tests/chat-harness.html');await page.addStyleTag({url:origin+'/src/interface-controls.css'});
 await page.evaluate(async()=>{
  const q=window.productAdoptionQA={calls:[],fail:true,incorporated:0};const {openWebsiteProducts}=await import('../src/website-product-adoption.js');
  await openWebsiteProducts({website:'fiction',name:'Fiction',rpc:async(name,args)=>{q.calls.push({name,args});if(args.p_apply){if(args.p_cursor===1&&q.fail){q.fail=false;throw Error('Interrupción ficticia');}q.incorporated=args.p_cursor+1;return {processed:1,cursor:args.p_cursor+1,more:args.p_cursor===0};}return {sourceProducts:2,incorporated:q.incorporated,conflicts:0,pricesReady:true,orphanCombinations:1};}});
 });
 await page.getByRole('button',{name:'Incorporar o actualizar catálogo',exact:true}).click();await page.getByRole('status').filter({hasText:'Interrupción ficticia'}).waitFor();await page.getByRole('button',{name:'Incorporar o actualizar catálogo',exact:true}).click();await page.getByRole('status').filter({hasText:'Ya puedes abrir sus productos'}).waitFor();
 const calls=await page.evaluate(()=>productAdoptionQA.calls);assert.deepEqual(calls.filter(c=>c.args.p_apply).map(c=>c.args.p_cursor),[0,1,1]);assert.ok(calls.every(c=>c.args.p_website==='fiction'));await page.getByText('Combinaciones sin producto de origen · 1',{exact:true}).waitFor();
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);await page.getByRole('button',{name:'Cerrar',exact:true}).click();assert.equal(await page.locator('dialog').count(),0);await page.close();
}console.log('Isolated product adoption UI: ordered batches, durable cursor recovery, orphan notice, store scope, mobile/desktop and close passed.');}finally{await browser.close();}
