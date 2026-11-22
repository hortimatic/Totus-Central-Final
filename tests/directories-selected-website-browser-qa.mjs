import assert from 'node:assert/strict';import {chromium} from 'playwright';import {startLocalServer} from './local-static-server.mjs';
const server=await startLocalServer({enabled:true}),browser=await chromium.launch({headless:true});
try{for(const kind of ['clientes','proveedores','marcas']){
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:4173/tests/chat-harness.html');
 await page.evaluate(async kind=>{
  const {createContactDirectoryUI,directoryPageHtml}=await import('../src/contact-directory-ui.js');
  const a='00000000-0000-0000-0000-000000000001',b='00000000-0000-0000-0000-000000000002',cid='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',resource={clientes:'customers',proveedores:'suppliers',marcas:'manufacturers'}[kind];
  const stores=[{id:a,key:a,name:'Web seleccionada'},{id:b,key:b,name:'Tienda física'}],context={websites:[{key:'web-fixture',business_id:a,status:'active'}],connections:[{id:cid,store_key:'web-fixture',revision:1,verified_revision:1,real_data_authorized:true,configured:true,enabled:true,protocol:'prestashop'}]};
  let record={id:'4',firstname:'Registro',lastname:'Web',name:'Registro web',email:'qa@example.invalid',active:'1'};window.webDirectoryCalls=[];
  const rpc=async(name)=>{window.webDirectoryCalls.push({rpc:name});if(name==='totus_directory_context')return context;return null;};
  const invoke=async q=>{window.webDirectoryCalls.push({body:q});if(q.store!=='web-fixture')throw Error('Wrong website');if(q.action==='prestashop_directory_read'){const rows=q.resource===resource?[record]:q.resource==='languages'?[{id:'2',active:'1',iso_code:'es'}]:[];return {ok:true,kind:q.kind,store:q.store,resource:q.resource,page:q.page,rows,possibly_more:false};}if(q.action==='prestashop_directory_prepare')return {ok:true,kind:q.kind,store:q.store,resource:q.resource,record_id:'4',fingerprint:'a'.repeat(64),can_commit:true};if(q.action==='prestashop_directory_commit'){record={...record,...q.fields};return {ok:true,kind:q.kind,store:q.store,resource:q.resource,record_id:'4',persisted:true,verified:true};}throw Error(q.action);};
  const centralData={stores:async()=>stores,all:async()=>[{id:'00000000-0000-0000-0000-000000000011',store_id:b,name:'Registro físico',details:{}}]};
  document.querySelector('#chatHarness').innerHTML=directoryPageHtml(kind,'');const ui=createContactDirectoryUI({rpc,invoke,centralData,actor:()=> 'owner',can:()=>true,openCentralEditor:async args=>{window.physicalEditor=args;}});await ui.mount(document.querySelector('[data-directory-root]'));
 },kind);
 await page.getByRole('button',{name:'Editar',exact:true}).click();const dialog=page.locator('dialog');await dialog.getByRole('textbox',{name:'Nombre',exact:true}).fill('Nombre web modificado');
 assert.equal(await dialog.getByRole('button',{name:'Publicar cambios en Web seleccionada',exact:true}).count(),1);
 if(kind==='clientes')assert.equal(await dialog.getByRole('textbox',{name:'Apellidos',exact:true}).count(),1);else assert.equal(await dialog.getByRole('textbox',{name:'Título SEO',exact:true}).count(),1);
 await dialog.getByRole('button',{name:'Publicar cambios en Web seleccionada',exact:true}).click();await dialog.waitFor({state:'hidden'});
 const calls=await page.evaluate(()=>window.webDirectoryCalls);assert.equal(calls.filter(c=>c.body?.action==='prestashop_directory_commit').length,1);assert(!calls.some(c=>c.rpc==='totus_local_store_write'));
 if(kind==='clientes'){
  await page.getByRole('combobox',{name:'Tienda de trabajo',exact:true}).selectOption('both');await page.getByRole('cell',{name:'Registro físico',exact:true}).first().waitFor();
  await page.getByRole('row').filter({hasText:'Nombre web modificado'}).getByRole('button',{name:'Editar',exact:true}).click();
  await page.locator('dialog').getByRole('button',{name:'Publicar cambios en Web seleccionada',exact:true}).waitFor();assert.equal(await page.getByRole('combobox',{name:'Tienda de trabajo',exact:true}).inputValue(),'00000000-0000-0000-0000-000000000001');await page.locator('dialog').getByRole('button',{name:'Cerrar',exact:true}).click();
 }
 await page.getByRole('combobox',{name:'Tienda de trabajo',exact:true}).selectOption('00000000-0000-0000-0000-000000000002');await page.getByRole('cell',{name:'Registro físico',exact:true}).first().waitFor();await page.getByRole('button',{name:'Editar',exact:true}).click();assert.equal(await page.evaluate(()=>window.physicalEditor.store),'00000000-0000-0000-0000-000000000002');assert.deepEqual(errors,[]);await page.close();
}console.log('Customers/Suppliers/Brands: native forms and selected-website publishing preserved; physical store editor isolated PASS');}finally{await browser.close();await server.close();}
