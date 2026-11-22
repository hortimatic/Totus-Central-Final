import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {startLocalServer} from './local-static-server.mjs';
const server=await startLocalServer({enabled:true}),browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:969,height:682}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4173/tests/chat-harness.html');for(const sheet of ['contact-directory.css','product-categories.css','interface-controls.css'])await page.addStyleTag({url:'http://127.0.0.1:4173/src/'+sheet});
 await page.evaluate(async()=>{
  const {createCategoriesWorkspace}=await import('../src/product-categories-ui.js');
  const host=document.querySelector('#chatHarness');host.style.maxWidth='100%';
  const local={storeId:'local',items:[],languages:[],revision:0,website:null,connected:false};
  const web={storeId:'web',items:[{id:'1',id_parent:'0',name:[{id:'1',value:'Root'},{id:'2',value:'Raíz'}],active:'1'},{id:'2',id_parent:'1',name:[{id:'1',value:'Home'},{id:'2',value:'Inicio'}],active:'1',is_root_category:'1'}],languages:[{id:'1',active:'0',iso_code:'en'},{id:'2',active:'1',iso_code:'es'}],revision:1,website:'web-fixture',connected:true};
  const connection={id:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',store_key:'web-fixture',protocol:'prestashop',enabled:true,configured:true,revision:1,verified_revision:1,real_data_authorized:true};
  window.qaCalls=[];window.qaNative=structuredClone(web.items);window.qaContext=local;
  const rpc=async(name,args)=>{window.qaCalls.push({name,args});if(name==='totus_directory_context')return {connections:[connection]};if(name==='totus_category_workspace')return structuredClone(args.p_store==='local'?local:web);if(name==='totus_category_local_save'){assertScope(args.p_store==='local');const id=args.p_id||'900000000000001';local.items=local.items.filter(r=>r.id!==id).concat({...args.p_fields,id});local.revision++;return {storeId:'local',verified:true,record_id:id};}throw Error(name);};
  const assertScope=ok=>{if(!ok)throw Error('Cross-store write');};
  const invoke=async body=>{window.qaCalls.push({body});if(body.action==='central_category_sync'){assertScope(body.store_id==='web');web.items=structuredClone(window.qaNative);web.revision++;return {storeId:'web',verified:true};}assertScope(body.store==='web-fixture'&&body.kind==='categorias');if(body.action==='prestashop_directory_prepare')return {ok:true,store:body.store,kind:body.kind,resource:body.resource,can_commit:true,fingerprint:'a'.repeat(64)};if(body.action==='prestashop_directory_commit'){const id=body.record_id||'3';window.qaNative=window.qaNative.filter(r=>r.id!==id).concat({...body.fields,id});return {ok:true,store:body.store,kind:body.kind,resource:body.resource,record_id:id,persisted:true,verified:true};}throw Error(body.action);};
  window.qaUI=createCategoriesWorkspace({rpc,invoke,actor:()=> 'owner',can:()=>true,storeName:s=>s==='local'?'Tienda física':'Web seleccionada'});window.qaUI.mount(host,'local');
 });
 await page.getByRole('button',{name:'Crear categoría',exact:true}).click();await page.getByRole('textbox',{name:'Nombre',exact:true}).fill('Categoría física');await page.getByRole('button',{name:'Guardar categoría',exact:true}).click();await page.getByRole('button',{name:'Editar Categoría física',exact:true}).waitFor();
 assert.equal(await page.evaluate(()=>window.qaCalls.filter(c=>c.name==='totus_category_local_save').length),1);
 await page.evaluate(()=>window.qaUI.mount(document.querySelector('#chatHarness'),'web'));await page.getByRole('button',{name:'Crear subcategoría de Inicio',exact:true}).waitFor();assert(!await page.getByText('Categoría física',{exact:true}).count());
 await page.getByRole('button',{name:'Crear subcategoría de Inicio',exact:true}).click();assert.equal(await page.locator('select[name=id_parent]').inputValue(),'2');await page.getByRole('textbox',{name:'Nombre',exact:true}).fill('Subcategoría web');await page.getByRole('button',{name:'Guardar y sincronizar',exact:true}).click();await page.getByRole('button',{name:'Editar Subcategoría web',exact:true}).waitFor();
 assert.equal(await page.evaluate(()=>window.qaCalls.filter(c=>c.body?.action==='prestashop_directory_commit').length),1);
 await page.evaluate(()=>{window.qaNative.find(r=>r.id==='3').name='Cambio hecho en la web';});await page.getByRole('button',{name:'Sincronizar con la web',exact:true}).click();await page.getByRole('button',{name:'Editar Cambio hecho en la web',exact:true}).waitFor();
 assert.deepEqual(errors,[]);console.log('Categories UI: physical create, selected-web child create, Spanish labels and web→Central refresh PASS');
}finally{await browser.close();await server.close();}
