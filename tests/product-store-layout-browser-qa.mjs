import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {startLocalServer} from './local-static-server.mjs';
const server=await startLocalServer({enabled:true}),browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const width of [1920,969,390]){
  await page.setViewportSize({width,height:900});await page.goto('http://127.0.0.1:4173/tests/chat-harness.html');
  for(const sheet of ['productos.css','interface-controls.css'])await page.addStyleTag({url:'http://127.0.0.1:4173/src/'+sheet});
  await page.evaluate(async width=>{
   const {createProductosUI,productosWorkspacePage}=await import('../src/productos-ui.js');const host=document.querySelector('#chatHarness');Object.assign(host.style,{maxWidth:'none',marginLeft:width>600?'300px':'0',padding:'16px'});host.innerHTML=productosWorkspacePage();
   const stores=['a','b','c'].map((key,index)=>({id:key,key,name:['Tienda con catálogo','Tienda pequeña','Tienda vacía'][index],label:key}));
   const item=(store,n)=>({id:store+'-'+n,store_id:store,source_id:String(n),name:'Producto '+n,sku:'REF-'+n,details:{},variants:[],catalogue:[]});
   const data={context:async()=>({stores}),catalogue:async store=>Array.from({length:store==='a'?31:store==='b'?3:0},(_,i)=>item(store,i+1)),directory:async(store,kind)=>store==='a'&&kind==='brands'?Array.from({length:20},(_,i)=>({id:String(i+1),name:'Marca '+i})):[],auxiliary:async()=>[]};
   await createProductosUI({rpc:async()=>({}),invoke:async()=>({}),actor:()=> 'layout-test',allowed:()=>true,centralData:data}).mount(document.querySelector('#productosRoot'));
  },width);
  const layouts=[];
  for(const store of ['a','b','c']){
   await page.locator('#store-context-select').selectOption(store);await page.locator('[data-pr-sort]:not([disabled])').waitFor();
   layouts.push(await page.locator('.prd-catalog-controls').evaluate(panel=>{const outer=panel.getBoundingClientRect(),style=getComputedStyle(panel),right=outer.right-parseFloat(style.paddingRight)-parseFloat(style.borderRightWidth);return ['.prd-catalog-filters','.prd-catalog-toolbar','.prd-catalog-loading'].map(selector=>{const rect=panel.querySelector(selector).getBoundingClientRect();return {selector,left:rect.left,width:rect.width,right:rect.right,availableRight:right};});}));
  }
  for(const layout of layouts)for(const part of layout)assert(Math.abs(part.right-part.availableRight)<2,`${width}: ${part.selector} must fill the panel`);
  for(let n=1;n<layouts.length;n++)for(let i=0;i<layouts[0].length;i++){assert(Math.abs(layouts[n][i].left-layouts[0][i].left)<1);assert(Math.abs(layouts[n][i].width-layouts[0][i].width)<1,`${width}: store content must not change control width`);}
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${width}: no page overflow`);
 }
 assert.deepEqual(errors,[]);console.log('Product controls: equal widths across 31, 3 and 0 products, with/without searchable selectors, at 1920, 969 and 390.');
}finally{await browser.close();server.close();}
