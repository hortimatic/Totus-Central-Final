import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto('http://127.0.0.1:4199/tests/chat-harness.html');
 await page.evaluate(async()=>{
  const {createProductosUI,productosWorkspacePage}=await import('../src/productos-ui.js');
  const {createCentralProductAdapter}=await import('../src/central-product-adapter.js');
  const {createLocalStoreWorkspace}=await import('../src/local-store-workspace.js');
  const a='00000000-0000-0000-0000-000000000001',b='00000000-0000-0000-0000-000000000002';
  const stores=[{id:a,name:'Hortimatic'},{id:b,name:'Tienda física'}];
  const product=(store,id,name)=>({id,store_id:store,name,sku:name,updated_at:'2026-11-21',details:{metaTitle:'SEO propio'},catalogue:[{id,price_cents:1210,tax_basis_points:2100,stock:3,active:true,revision:1,quantity_unit:'unit'}],variants:[]});
  const records=new Map([[a,[product(a,'00000000-0000-0000-0000-000000000011','Producto online')]], [b,[product(b,'00000000-0000-0000-0000-000000000012','Producto físico')]]]);
  const online=records.get(a)[0];online.source_website='web-online';online.details.sourceData={id_default_image:'123',id_category_default:'8',associations:{categories:[{id:'8'}]}};
  const variantId='00000000-0000-0000-0000-000000000099';online.variants=[{id:variantId,sku:'VAR',attributes:{Color:'Rojo'}}];online.catalogue[0].variant_id=variantId;
  window.centralProductsQA={calls:[],records};
  const rpc=async(name,args)=>{
   if(typeof name!=='string'||!args||typeof args!=='object')throw Error('RPC contract mismatch');centralProductsQA.calls.push({name,args});
   if(args.p_kind==='context')return {stores};
   if(name==='totus_central_product_resources')return {storeId:args.p_store,resource:args.p_resource,website:args.p_store===a?'web-online':null,revision:1,nextCursor:null,items:args.p_store!==a?[]:({categories:[{id:'8',name:'Categoría guardada'}],product_options:[{id:'5',name:'Color',public_name:'Color'}],product_option_values:[{id:'7',id_attribute_group:'5',name:'Rojo'}]})[args.p_resource]||[]};
   if(name==='totus_local_store_workspace'&&args.p_action==='save'){
    const p=records.get(args.p_store).find(p=>p.id===args.p_id);p.name=args.p_data.name;p.details.metaTitle=args.p_data.metaTitle;return {saved:true,id:p.id,storeId:args.p_store};
   }
   const rows=args.p_kind==='products'?records.get(args.p_store)||[]:[];
   if(name==='totus_local_store_read_page')return {storeId:args.p_store,items:args.p_id?rows.filter(p=>p.id===args.p_id):rows,total:rows.length,nextCursor:null};
   return {storeId:args.p_store,items:rows};
  };
  const local=createLocalStoreWorkspace({rpc,actor:()=> 'admin',can:()=>true});
  const adapter=createCentralProductAdapter({rpc,actor:()=> 'admin'});
  document.querySelector('#chatHarness').innerHTML=productosWorkspacePage();
  const ui=createProductosUI({rpc,actor:()=> 'admin',allowed:()=>true,canEdit:()=>true,canCreate:()=>true,canDelete:()=>true,canExport:()=>true,centralData:adapter,openCentralEditor:args=>local.openEditor(args),invoke:async()=>{throw Error('Unexpected remote API call');}});
  centralProductsQA.ui=ui;await ui.mount(document.querySelector('#productosRoot'));
 });
 await page.getByRole('cell',{name:'Producto online',exact:true}).first().waitFor();
 assert.equal(await page.locator('#productosRoot').count(),1);
 assert.ok(await page.getByRole('option',{name:'Categoría guardada',exact:true}).count()>0,'Saved categories populate the existing filter');
 await page.getByRole('tab',{name:'Atributos y características',exact:true}).click();
 await page.locator('[data-attr-action="select"]').filter({hasText:'Color'}).waitFor();
 await page.getByRole('button',{name:'Productos asociados',exact:true}).click();
 await page.locator('.prd-attribute-associated').getByText('Producto online',{exact:true}).waitFor();
 assert.equal(await page.locator('.prd-attributes-heading').first().getByText(/Hortimatic/).count(),1);
 await page.getByRole('tab',{name:'1. Catálogo General',exact:true}).first().click();
 assert.equal(await page.locator('details').filter({hasText:'Webs conectadas y referencias generales'}).count(),0);
 assert.equal(await page.locator('tbody').getByText('Producto físico',{exact:true}).count(),0);
 await page.getByRole('combobox',{name:'Tienda de trabajo',exact:true}).selectOption('00000000-0000-0000-0000-000000000002');
 await page.getByRole('cell',{name:'Producto físico',exact:true}).first().waitFor();
 assert.equal(await page.locator('tbody').getByText('Producto online',{exact:true}).count(),0);
 await page.getByRole('button',{name:'Abrir ficha',exact:true}).click();
 const dialog=page.locator('dialog');await dialog.getByRole('textbox',{name:'Nombre',exact:true}).fill('Producto físico actualizado');
 await dialog.getByRole('textbox',{name:'Título SEO',exact:true}).fill('SEO actualizado');
 await dialog.getByRole('button',{name:'Guardar',exact:true}).click();
 await page.getByRole('cell',{name:'Producto físico actualizado',exact:true}).first().waitFor();
 assert.equal(await page.locator('dialog').count(),0);
 const calls=await page.evaluate(()=>centralProductsQA.calls);assert.ok(calls.every(c=>typeof c.name==='string'&&typeof c.args==='object'));assert.equal(calls.filter(c=>c.name==='totus_local_store_read_page'&&c.args.p_kind==='products').length>=2,true);assert.ok(!calls.some(c=>/prestashop|connections/.test(c.name)),JSON.stringify([...new Set(calls.map(c=>c.name))]));
 const saved=calls.find(c=>c.args.p_action==='save');assert.equal(saved.args.p_store,'00000000-0000-0000-0000-000000000002');assert.equal(saved.args.p_data.metaTitle,'SEO actualizado');
 assert.deepEqual(errors,[]);
 console.log('Existing Products workspace: saved catalogue, shared physical/online selector, store isolation, real editor controls and refreshed saved SEO verified without a web API.');
}finally{await browser.close();}
