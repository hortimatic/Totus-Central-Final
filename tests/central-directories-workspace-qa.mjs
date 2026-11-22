import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {startLocalServer} from './local-static-server.mjs';
const server=await startLocalServer({enabled:true});
const browser=await chromium.launch({headless:true});
try{for(const kind of ['clientes','proveedores','marcas']){
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4173/tests/chat-harness.html');
 await page.evaluate(async kind=>{
  const {createContactDirectoryUI,directoryPageHtml}=await import('../src/contact-directory-ui.js');
  const {createCentralStoreData}=await import('../src/central-store-data.js');
  const {createLocalStoreWorkspace}=await import('../src/local-store-workspace.js');
  const a='00000000-0000-0000-0000-000000000001',b='00000000-0000-0000-0000-000000000002',id='00000000-0000-0000-0000-000000000011';
  const stores=[{id:a,name:'Hortimatic'},{id:b,name:'Tienda física'}],records=[{id,store_id:a,name:'Registro online',email:'fiction@example.test',phone:'123',details:{sourceData:{meta_title:'SEO conservado'},addresses:[]}}, {id:'00000000-0000-0000-0000-000000000012',store_id:b,name:'Registro físico',details:{addresses:[]}}];
  window.directoryNativeQA={calls:[]};
  const rpc=async(name,args)=>{if(typeof name!=='string'||!args||typeof args!=='object')throw Error('RPC contract mismatch');directoryNativeQA.calls.push({name,args});if(args.p_kind==='context')return {stores};if(name==='totus_directory_table')return null;if(args.p_action==='save'){const row=records.find(r=>r.id===args.p_id);row.name=args.p_data.name;return {saved:true,id:row.id,storeId:args.p_store};}const items=records.filter(r=>r.store_id===args.p_store&&(!args.p_id||r.id===args.p_id));return name==='totus_local_store_read_page'?{storeId:args.p_store,items,total:items.length,nextCursor:null}:{storeId:args.p_store,items};};
  const local=createLocalStoreWorkspace({rpc,actor:()=> 'admin',can:()=>true});
  document.querySelector('#chatHarness').innerHTML=directoryPageHtml(kind,'');
  const ui=createContactDirectoryUI({rpc,actor:()=> 'admin',can:()=>true,centralData:createCentralStoreData({rpc,actor:()=> 'admin'}),openCentralEditor:args=>local.openEditor(args),invoke:async()=>{throw Error('Unexpected website API');}});
  await ui.mount(document.querySelector('[data-directory-root]'));
 },kind);
 await page.getByRole('cell',{name:'Registro online',exact:true}).first().waitFor();
 assert.equal(await page.locator('.directory-internal-tools').count(),0);
 assert.equal(await page.locator('[data-local-store-workspace]').count(),0);
 await page.getByRole('combobox',{name:'Tienda de trabajo',exact:true}).selectOption('00000000-0000-0000-0000-000000000002');
 await page.getByRole('cell',{name:'Registro físico',exact:true}).first().waitFor();
 assert.equal(await page.getByRole('cell',{name:'Registro online',exact:true}).count(),0);
 await page.getByRole('button',{name:'Editar',exact:true}).click();
 await page.locator('dialog').getByRole('textbox',{name:'Nombre',exact:true}).fill('Registro actualizado');
 await page.locator('dialog').getByRole('button',{name:'Guardar',exact:true}).click();
 await page.getByRole('cell',{name:'Registro actualizado',exact:true}).first().waitFor();
 const calls=await page.evaluate(()=>directoryNativeQA.calls);
 assert.ok(!calls.some(c=>/prestashop|connections/.test(c.name)));
 assert.equal(calls.find(c=>c.args.p_action==='save').args.p_store,'00000000-0000-0000-0000-000000000002');
 assert.deepEqual(errors,[]);await page.close();
}console.log('Existing Customers/Suppliers/Brands workspaces: Central records, common physical/online selector, isolation and saved edits verified through UI controls.');}finally{await browser.close();await server.close();}
