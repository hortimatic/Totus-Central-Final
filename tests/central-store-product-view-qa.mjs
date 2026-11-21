import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage();
 await page.goto('http://127.0.0.1:4199/tests/chat-harness.html');
 const result=await page.evaluate(async()=>{
  const {stitchHeader,stitchCatalog}=await import('../src/productos-stitch-view.js');
  const {WEBSITE_CHOICES}=await import('../src/website-registry.js');
  const before=JSON.stringify(WEBSITE_CHOICES);
  const stores=[{key:'physical-id',name:'Tienda física <propia>'},{key:'online-id',name:'Tienda online'}];
  const main=document.createElement('main');document.body.append(main);
  main.innerHTML=stitchHeader({stores,central:true,store:'physical-id',mode:'catalogo',count:1,status:'Catálogo de Central',connected:false})+
   stitchCatalog({stores,central:true,store:'physical-id',rows:[],columns:['name','reference'],selected:new Set(),query:'',filters:{category:'',brand:'',active:''},brands:[],categories:[],page:0,size:20,hasMore:false,pending:false,ready:true,value:()=>'',photo:()=>null});
  return {selectors:[...main.querySelectorAll('[data-pr-store]')].map(s=>({value:s.value,options:[...s.options].map(o=>[o.value,o.textContent])})),text:main.textContent,registryUnchanged:before===JSON.stringify(WEBSITE_CHOICES),injectedElements:main.querySelectorAll('propia').length};
 });
 assert.equal(result.selectors.length,2);
 assert.ok(result.selectors.every(s=>s.value==='physical-id'&&s.options.some(o=>o[0]==='online-id')&&s.options.some(o=>o[1]==='Todas las tiendas')));
 assert.match(result.text,/Datos de Central/);
 assert.doesNotMatch(result.text,/Conexión pendiente|Conexión API verificada/);
 assert.equal(result.registryUnchanged,true);
 assert.equal(result.injectedElements,0);
 console.log('Existing product workspace accepts physical and online stores without changing the website registry or claiming an API connection.');
}finally{await browser.close();}
