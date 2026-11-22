import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {startLocalServer} from './local-static-server.mjs';
import {compareTableValues} from '../src/table-sort.js';
assert(compareTableValues('2','10')<0);
assert(compareTableValues('1.234,50 €','99,00 €')>0);
assert(compareTableValues('01/02/2026','31/01/2026')>0);
assert(compareTableValues('—','0','desc')>0);
const server=await startLocalServer({enabled:true}),browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:969,height:682}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:4173/tests/chat-harness.html');
 await page.evaluate(async()=>{
  const {createProductosUI,productosWorkspacePage}=await import('../src/productos-ui.js');
  const products=Array.from({length:31},(_,index)=>{const n=index+1,id='p-'+n;return {id,source_id:String(n),name:'Producto '+n,store_id:'shop',sku:'REF-'+n,created_at:'2026-11-22T01:00:00Z',updated_at:'2026-11-22T01:00:00Z',details:{sourceData:{date_add:new Date(Date.UTC(2026,9,n)).toISOString()}},variants:[],catalogue:[{id,price_cents:n*100,tax_basis_points:2100,stock:n,active:true}]};}).reverse();
  document.querySelector('#chatHarness').innerHTML=productosWorkspacePage();
  const data={context:async()=>({stores:[{id:'shop',key:'shop',name:'Tienda de prueba',label:'Tienda de prueba'}]}),catalogue:async()=>structuredClone(products),directory:async()=>[],auxiliary:async()=>[]};
  const ui=createProductosUI({rpc:async()=>({}),invoke:async()=>{throw Error('No remote writes');},actor:()=> 'sort-test',allowed:()=>true,centralData:data});await ui.mount(document.querySelector('#productosRoot'));
 });
 const firstId=()=>page.locator('#catalogo-table-body tr:first-child [data-pr-column-cell=id]').innerText();
 await page.locator('#catalogo-table-body tr').first().waitFor();assert.equal(await page.locator('[data-pr-sort] option').first().textContent(),'Más recientes');assert.equal(await page.getByRole('button',{name:'Buscar en Ordenar productos',exact:true}).count(),0);assert.equal(await firstId(),'31','Source creation date, before pagination; import timestamp must not replace it');
 await page.getByRole('button',{name:'Ordenar por ID',exact:true}).click();assert.equal(await firstId(),'1');assert.equal(await page.locator('[data-pr-column-heading=id]').getAttribute('aria-sort'),'ascending');
 await page.getByRole('button',{name:'Siguiente',exact:true}).click();assert.equal(await firstId(),'21','Sort full result set before taking the second page');
 await page.getByRole('button',{name:'Ordenar por ID',exact:true}).click();assert.equal(await firstId(),'31');assert.equal(await page.locator('[data-pr-page-number]').inputValue(),'1');
 await page.getByRole('combobox',{name:'Ordenar productos',exact:true}).selectOption('date_add:asc');assert.equal(await firstId(),'1');
 await page.getByRole('combobox',{name:'Ordenar productos',exact:true}).selectOption('gross:desc');assert.equal(await firstId(),'31');
 await page.locator('[data-pr-search]').fill('Producto 2');await page.getByRole('combobox',{name:'Ordenar productos',exact:true}).selectOption('id:asc');assert.equal(await firstId(),'2');
 await page.evaluate(async()=>{
  const {createProductosUI,productosWorkspacePage}=await import('../src/productos-ui.js');const {productDraftStore}=await import('../src/productos-draft-store.js');
  const a='00000000-0000-0000-0000-000000000001',b='00000000-0000-0000-0000-000000000002',owner='scope-regression';localStorage.setItem('totus.central-store.v1:'+owner,b);
  const draft={store:b,catalogScope:a,mode:'catalogo',requestBrief:{url:'https://example.invalid/reference'},variants:[],fields:new Set(),overrides:{},variantFields:new Map(),variantOverrides:new Map(),targets:new Set(),comparison:new Map(),preview:[],targetOverrides:new Map(),preflight:new Map(),targetRaw:new Map(),targetLanguages:new Map(),targetIds:new Map(),variantPreflight:new Map(),bulkItems:[],bulkConfirm:'',parallelSection:'main',shops:[],editRequests:[],editConfirm:[]};await productDraftStore(owner,draft);
  const product=(store,name)=>({id:'p1',store_id:store,name,sku:name,variants:[],catalogue:[],details:{}});
  const data={context:async()=>({stores:[{id:a,key:a,name:'Web A',label:'Web A'},{id:b,key:b,name:'Tienda B',label:'Tienda B'}]}),catalogue:async store=>[product(store,store===a?'Producto de Web A':'Producto de Tienda B')],directory:async()=>[],auxiliary:async()=>[]};
  document.querySelector('#chatHarness').innerHTML=productosWorkspacePage();await createProductosUI({rpc:async()=>({}),invoke:async()=>({}),actor:()=>owner,allowed:()=>true,centralData:data}).mount(document.querySelector('#productosRoot'));
 });
 assert.equal(await page.locator('#store-context-select').inputValue(),'00000000-0000-0000-0000-000000000001');assert.match(await page.locator('#catalogo-table-body').innerText(),/Producto de Web A/);assert.doesNotMatch(await page.locator('#catalogo-table-body').innerText(),/Producto de Tienda B/);
 await page.evaluate(async()=>{
  const {installSharedTableArrows}=await import('../src/shared-table-controls.js');document.body.innerHTML='<main id="grid"><div class="table-wrap"><table class="data-table"><thead><tr><th>Fecha</th><th>Importe</th><th>Acciones</th></tr></thead><tbody><tr><td>01/02/2026</td><td>2,00 €</td><td><button>Ver A</button></td></tr><tr><td>31/01/2026</td><td>10,00 €</td><td><button>Ver B</button></td></tr></tbody></table></div><section class="invoice-preview"><table><thead><tr><th>Producto</th><th>Precio</th></tr></thead><tbody><tr><td>Ejemplo</td><td>1</td></tr></tbody></table></section></main>';installSharedTableArrows(document.querySelector('#grid'),{owner:()=> 'sort-test'});
 });
 await page.getByRole('button',{name:'Ordenar por Importe',exact:true}).click();assert.match(await page.locator('.data-table tbody tr:first-child').innerText(),/Ver A/);
 await page.getByRole('button',{name:'Ordenar por Importe',exact:true}).click();assert.match(await page.locator('.data-table tbody tr:first-child').innerText(),/Ver B/);
 await page.getByRole('button',{name:'Ordenar por Fecha',exact:true}).click();assert.match(await page.locator('.data-table tbody tr:first-child').innerText(),/31\/01\/2026/);
 assert.equal(await page.locator('.invoice-preview [data-tc-sort-column]').count(),0);assert.deepEqual(errors,[]);
 console.log('Sort: numeric IDs, dates, money, missing values, full catalogue pagination, filters, common table arrows and document exclusion verified.');
}finally{await browser.close();server.close();}
