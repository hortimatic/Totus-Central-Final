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
  records.get(b)[0].details.sourceData={associations:{images:[{id:'71'},{id:'72'}]}};
  const online=records.get(a)[0];online.source_website='web-online';online.details.sourceData={id_default_image:'123',id_category_default:'8',associations:{categories:[{id:'8'}]}};
  const variantId='00000000-0000-0000-0000-000000000099';online.variants=[{id:variantId,sku:'VAR',attributes:{Color:'Rojo'}}];online.catalogue[0].variant_id=variantId;
  const nativeMasters=new Map();window.centralProductsQA={calls:[],records};
  const rpc=async(name,args)=>{
   if(typeof name!=='string'||!args||typeof args!=='object')throw Error('RPC contract mismatch');centralProductsQA.calls.push({name,args});
   if(args.p_kind==='context')return {stores};
   if(name==='totus_central_product_sync_status')return {storeId:args.p_store,items:centralProductsQA.cancelled?[]:[{id:'00000000-0000-0000-0000-000000000070',productId:records.get(args.p_store)[0].id,status:'conflict',notice:'Cambio en la web',updatedAt:'2026-11-21T10:00:00Z'}]};
   if(name==='totus_central_product_sync_control'){centralProductsQA.cancelled=true;return {storeId:args.p_store,id:args.p_job,status:'cancelled'};}
   if(name==='totus_central_attribute_save'){const key=args.p_store+'|'+args.p_resource,list=nativeMasters.get(key)||[];const row={...args.p_fields,id:crypto.randomUUID(),__revision:'own-1'};list.push(row);nativeMasters.set(key,list);return {storeId:args.p_store,resource:args.p_resource,recordId:row.id,saved:true};}
   if(name==='totus_central_attribute_catalogue'&&nativeMasters.has(args.p_store+'|'+args.p_resource))return {storeId:args.p_store,resource:args.p_resource,items:nativeMasters.get(args.p_store+'|'+args.p_resource)};
   if(name==='totus_central_attribute_catalogue')return {storeId:args.p_store,resource:args.p_resource,items:args.p_store!==a?[]:(({product_options:[{id:'5',name:'Color',public_name:'Color',__revision:'r1'}],product_option_values:[{id:'7',id_attribute_group:'5',name:'Rojo',__revision:'r1'}]})[args.p_resource]||[])};
   if(name==='totus_central_product_resources')return {storeId:args.p_store,resource:args.p_resource,website:args.p_store===a?'web-online':null,revision:1,nextCursor:null,items:args.p_store!==a?[]:({categories:[{id:'8',name:'Categoría guardada'}],product_options:[{id:'5',name:'Color',public_name:'Color'}],product_option_values:[{id:'7',id_attribute_group:'5',name:'Rojo'}]})[args.p_resource]||[]};
   if(name==='totus_central_product_save'||name==='totus_local_store_workspace'&&args.p_action==='save'){
    const p=records.get(args.p_store).find(p=>p.id===args.p_id);p.name=args.p_data.name;p.sku=args.p_data.reference;p.details={...p.details,...args.p_data};for(const c of p.catalogue){c.active=args.p_data.active;c.revision++;}return {saved:true,id:p.id,storeId:args.p_store,queued:0};
   }
   const rows=args.p_kind==='products'?records.get(args.p_store)||[]:[];
   if(name==='totus_local_store_read_page')return {storeId:args.p_store,items:args.p_id?rows.filter(p=>p.id===args.p_id):rows,total:rows.length,nextCursor:null};
   return {storeId:args.p_store,items:rows};
  };
  const local=createLocalStoreWorkspace({rpc,actor:()=> 'admin',can:()=>true});
  const adapter=createCentralProductAdapter({rpc,actor:()=> 'admin'});
  document.querySelector('#chatHarness').innerHTML=productosWorkspacePage('pricing');
  const ui=createProductosUI({rpc,actor:()=> 'admin',allowed:()=>true,canEdit:()=>true,canCreate:()=>true,canDelete:()=>true,canExport:()=>true,centralData:adapter,openCentralEditor:args=>local.openEditor(args),invoke:async args=>{if(args.action==='central_product_sync')return {ok:true,storeId:args.store_id,processed:0};throw Error('Unexpected remote API call');}});
  centralProductsQA.ui=ui;await ui.mount(document.querySelector('#productosRoot'));
 });
 await page.getByRole('cell',{name:'Producto online',exact:true}).first().waitFor();
 assert.equal(await page.locator('#productosRoot').count(),1);
 await page.getByRole('combobox',{name:'Tienda de trabajo',exact:true}).selectOption('00000000-0000-0000-0000-000000000002');
 await page.getByRole('cell',{name:'Producto físico',exact:true}).first().waitFor();
 assert.equal(await page.getByRole('cell',{name:'Producto online',exact:true}).count(),0);
 await page.getByRole('combobox',{name:'Tienda de trabajo',exact:true}).selectOption('00000000-0000-0000-0000-000000000001');
 await page.getByRole('cell',{name:'Producto online',exact:true}).first().waitFor();
 assert.deepEqual(errors,[]);console.log('Pricing native catalogue store switching verified');
}finally{await browser.close();}
