import assert from 'node:assert/strict';import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true});
try{for(const width of [390,1440]){
 const page=await browser.newPage({viewport:{width,height:1000}});
 await page.goto('http://127.0.0.1:4173/tests/chat-harness.html');
 await page.addStyleTag({url:'http://127.0.0.1:4173/src/appearance.css'});await page.addStyleTag({url:'http://127.0.0.1:4173/src/interface-controls.css'});
 await page.evaluate(async()=>{window.directoryQA={calls:[],fail:true,done:0};const q=window.directoryQA;const {openWebsiteDirectories}=await import('../src/website-directory-adoption.js');await openWebsiteDirectories({website:'fiction-a',name:'Fiction',rpc:async(name,args)=>{q.calls.push({name,args});if(args.p_apply){if(args.p_resource==='suppliers'&&q.fail){q.fail=false;throw Error('Interrupción ficticia');}q.done++;return {cursor:2,more:false,conflicts:0};}return {resources:{manufacturers:{available:1,incorporated:q.done?1:0},suppliers:{available:1,incorporated:0},customers:{available:1,incorporated:0}}};}});});
 await page.getByRole('button',{name:'Incorporar o actualizar directorios',exact:true}).click();await page.getByRole('status').filter({hasText:'Interrupción ficticia'}).waitFor();
 await page.getByRole('button',{name:'Incorporar o actualizar directorios',exact:true}).click();await page.getByRole('status').filter({hasText:'Ya puedes abrir sus fichas'}).waitFor();
 const calls=await page.evaluate(()=>directoryQA.calls);assert.deepEqual(calls.filter(c=>c.args.p_apply).slice(-3).map(c=>c.args.p_resource),['manufacturers','suppliers','customers']);assert.ok(calls.every(c=>c.args.p_website==='fiction-a'));
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'fits '+width);await page.getByRole('button',{name:'Cerrar',exact:true}).click();assert.equal(await page.locator('dialog').count(),0);await page.close();
}console.log('Isolated directory UI: ordered adoption, interruption, restart, scope, desktop/mobile and close passed.');}finally{await browser.close();}
