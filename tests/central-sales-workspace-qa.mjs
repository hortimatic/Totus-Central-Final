import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {centralSaleRow} from '../src/central-sales-data.js';
assert.throws(()=>centralSaleRow({total_cents:100,paid_cents:100,snapshot:{lines:[]}}),/incompleta/);
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4199/tests/chat-harness.html');
 await page.evaluate(async()=>{
  window.supabase={createClient:()=>({})};
  const {createPrestashopUI}=await import('../src/prestashop-ui.js');const {createCentralStoreData}=await import('../src/central-store-data.js');
  const a='00000000-0000-0000-0000-000000000001',b='00000000-0000-0000-0000-000000000002';
  const sale=(store,id,total,name)=>({id,reference:id.endsWith("11")?"TC-11":"TC-12",store_id:store,created_at:new Date().toISOString(),total_cents:total,paid_cents:total,customer_id:null,
   snapshot:{currency:'EUR',productsNetCents:1000,lines:[{productId:'product',name,reference:'SKU',qty:1,unitCents:total,totalCents:total,netCents:1000,taxBasisPoints:2100}]},payments:[{method:'card',amount_cents:total}],refunds:[{status:'confirmed',total_cents:100}]});
  const records=new Map([[a,[sale(a,'00000000-0000-0000-0000-000000000011',1210,'Artículo online')]], [b,[sale(b,'00000000-0000-0000-0000-000000000012',2420,'Artículo físico')]]]);
  window.salesNativeQA={calls:[]};
  const rpc=async(name,args)=>{salesNativeQA.calls.push({name,args});if(name==='totus_orders_table_layout')return null;if(args.p_kind==='context')return {stores:[{id:a,name:'Hortimatic'},{id:b,name:'Tienda física'}]};if(args.p_kind==='sales')return {storeId:args.p_store,items:records.get(args.p_store)};throw Error('Unexpected RPC '+name);};
  document.querySelector('#chatHarness').innerHTML='<section id="salesRoot"></section>';
  const ui=createPrestashopUI({salesOnly:true,rpc,actor:()=> 'admin',allowed:()=>true,centralData:createCentralStoreData({rpc,actor:()=> 'admin'}),invoke:async()=>{throw Error('Unexpected remote API');}});
  await ui.mount(document.querySelector('#salesRoot'));
 });
 await page.locator('[data-prestashop-action="tab"][data-tab="orders"]').click();
 await page.getByRole('cell',{name:'TC-11',exact:true}).waitFor();
 await page.getByRole('combobox',{name:'Tienda de trabajo',exact:true}).selectOption('00000000-0000-0000-0000-000000000002');
 await page.getByRole('cell',{name:'TC-12',exact:true}).waitFor();
 assert.equal(await page.getByRole('cell',{name:'TC-11',exact:true}).count(),0);
 await page.getByRole('button',{name:'Ver pedido 00000000-0000-0000-0000-000000000012',exact:true}).click();
 await page.getByText('Artículo físico',{exact:true}).last().waitFor();
 assert.match(await page.locator('.ps-order-expanded').innerText(),/Devoluciones confirmadas/);
 assert.match(await page.locator('.ps-order-expanded').innerText(),/Tarjeta/);
 assert.ok(!(await page.evaluate(()=>salesNativeQA.calls)).some(c=>/prestashop|connections|sales_context/.test(c.name)));
 assert.deepEqual(errors,[]);
 console.log('Existing Sales workspace: native totals, common store selector, period, isolation, line details, card payments and refunds verified without PrestaShop.');
}finally{await browser.close();}
