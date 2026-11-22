import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:1600,height:1000}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4199/tests/chat-harness.html');
 await page.addStyleTag({url:'http://127.0.0.1:4199/src/appearance.css'});await page.addStyleTag({url:'http://127.0.0.1:4199/src/home-widgets.css'});
 await page.addStyleTag({url:'http://127.0.0.1:4199/src/interface-controls.css'});
 await page.evaluate(async()=>{
  window.supabase={createClient:()=>({})};
  const {state}=await import('../src/state.js'),{createHomeWidgetsUI}=await import('../src/home-widgets-ui.js'),{homeToday}=await import('../src/home-period.js');
  const today=homeToday();state.data.settings={};state.user={id:'owner',role:'admin'};state.route='inicio';state.data.stores=[{id:'11111111-1111-4111-8111-111111111111',name:'Tienda física'},{id:'22222222-2222-4222-8222-222222222222',name:'Tienda online'}];state.data.expenses=[];state.data.closings=[];
  const {inicio}=await import('../src/pages/main.js');document.body.innerHTML='<main id="content">'+inicio()+'</main>';
  let saved=null,revision=0;window.calls=[];window.api=createHomeWidgetsUI({confirm:async()=>true,onOpenCash:()=>window.openedNativeCash=true,rpc:async(name,p)=>{
   window.calls.push({name,p});const suffix=p?.p_store?.startsWith('1111')?'local':'web';
   if(name==='totus_home_dashboard'){if(p.p_action==='save'){for(const w of p.p_layout.widgets)if(w.scope.store!=='all'&&!/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(w.scope.store))throw Error('Datos de widget no admitidos');saved=p.p_layout;revision++;}return {layout:saved,revision};}
   if(name==='totus_home_tpv_summary')return {storeId:p.p_store,from:p.p_from,to:p.p_to,source:'totustpv',salesCents:p.p_store==='11111111-1111-4111-8111-111111111111'?1000:2000,refundCents:200,saleCount:1,refundCount:1,marginCents:300,marginComplete:true,top:[{id:'product',name:'Artículo '+suffix,quantity:1}],series:[{date:today,salesCents:800,orders:1}]};
   if(name==='totus_local_store_workspace')return {storeId:p.p_store,items:p.p_kind==='sales'?[{id:suffix+'-sale',store_id:p.p_store,created_at:today+'T12:00:00Z',total_cents:p.p_store==='11111111-1111-4111-8111-111111111111'?1000:2000,payments:[{method:'card'}],refunds:[],snapshot:{customerName:'Cliente '+suffix,lines:[{productId:'product',name:'Artículo '+suffix,qty:1,totalCents:1000,netCents:826}]}}]:[]};
   return {rows:[]};
  },invoke:()=>{throw Error('No se permite consultar una web para los datos nativos.');},can:()=>true});window.api.mount(document.body);const draft=await import('../src/form-drafts.js');draft.captureFormDraft(document.body);window.hasBusinessDraft=()=>draft.hasFormDraft(document.body);
 });
 await page.waitForFunction(()=>document.querySelector('[data-home-widget="orders"]')?.textContent.includes('Artículo local'),null,{timeout:5000}).catch(async e=>{console.log({errors,calls:await page.evaluate(()=>window.calls.map(c=>c.name))});throw e;});
 await page.getByRole('button',{name:'Cajas del TPV',exact:true}).click();assert.equal(await page.evaluate(()=>window.openedNativeCash),true);
 const expected=['opening','income','expense','result','internal','gain-summary','activity','shop-h','shop-n','orders','tasks','store','price','documents','expense-quarter','billing','fiscal','system','recent-closings','quick-links'];
 assert.deepEqual(await page.locator('[data-home-widget]').evaluateAll(nodes=>nodes.map(n=>n.dataset.homeWidget)),expected);
 assert.equal(await page.evaluate(()=>window.api.hasUnsaved()),false);
 assert.match(await page.locator('[data-home-widget="shop-h"]').innerText(),/8,00/);
 assert.match(await page.locator('[data-home-widget="shop-n"]').innerText(),/18,00/);
 assert.equal(await page.locator('[data-home-widget="activity"] .activity-chart svg').count(),1);
 for(const id of ['store','documents','expense-quarter','billing','fiscal']){await page.locator(`[data-home-widget="${id}"] [data-home-filter="store"]`).selectOption('22222222-2222-4222-8222-222222222222');assert.equal(await page.locator(`[data-home-widget="${id}"] [data-home-filter="store"]`).inputValue(),'22222222-2222-4222-8222-222222222222');}
 for(const id of expected){
  await page.locator(`[data-home-widget="${id}"] [data-home-command="select"]`).click();
  assert.equal(await page.locator('[data-home-config="width"]').count(),1,`Configuración de ${id}`);assert.equal(await page.evaluate(()=>window.hasBusinessDraft()),false,'El inspector no genera un borrador empresarial');
  await page.getByRole('button',{name:'Cancelar edición',exact:true}).click();
 }
 console.log('AFTER CONFIG',await page.evaluate(()=>({edit:document.querySelector('.dashboard-page').className,dirty:window.api.hasUnsaved()})));
 const activity=page.locator('[data-home-widget="activity"]');
 await activity.locator('[data-home-command="period-week"]').click();
 assert.equal(await activity.locator('[data-home-command="period-week"]').getAttribute('aria-pressed'),'true');
 await activity.locator('[data-home-filter="store"]').selectOption('22222222-2222-4222-8222-222222222222');
 await page.waitForFunction(()=>document.querySelector('[data-home-widget="activity"] [data-home-filter="store"]')?.value==='22222222-2222-4222-8222-222222222222');
 assert.equal(await page.evaluate(()=>window.api.hasUnsaved()),false,'Los filtros no provocan avisos de guardado');
 await page.locator('[data-home-widget="orders"] [data-home-filter="query"]').fill('local-sale');
 await page.locator('[data-home-widget="orders"] [data-home-filter="query"]').dispatchEvent('change');
 assert.match(await page.locator('[data-home-widget="orders"]').innerText(),/Artículo local/);
 assert.doesNotMatch(await page.locator('[data-home-widget="orders"] tbody').innerText(),/Artículo web/);
 await page.locator('[data-home-widget="orders"] [data-home-command="open-order"]').first().click();
 assert.equal(await page.locator('dialog[open]').count(),1);
 assert.match(await page.locator('dialog').innerText(),/Artículo local/);
 await page.getByRole('button',{name:'Cerrar ticket',exact:true}).click();
 assert.equal(await page.locator('dialog').count(),0);
 for(const id of ['shop-h','shop-n','orders','gain-summary']){
  await page.locator(`[data-home-widget="${id}"] [data-home-command="fetch"]`).first().click();
 }
 assert.equal(await page.evaluate(()=>window.api.hasUnsaved()),false);
 await page.getByRole('button',{name:'Personalizar inicio'}).click();
 await page.locator('[data-home-command="panel-library"]').click();await page.getByRole('button',{name:'Añadir Resumen TotusTPV',exact:true}).click();assert.equal(await page.locator('[data-home-widget]').count(),21);await page.getByRole('button',{name:'Quitar instancia',exact:true}).click();assert.equal(await page.locator('[data-home-widget]').count(),20);await page.getByRole('button',{name:'Deshacer',exact:true}).click();assert.equal(await page.locator('[data-home-widget]').count(),21);await page.getByRole('button',{name:'Rehacer',exact:true}).click();assert.equal(await page.locator('[data-home-widget]').count(),20);
 await page.locator('[data-home-widget="documents"] [data-home-command="select"]').click();await page.getByRole('button',{name:'Ocultar',exact:true}).click();assert.equal(await page.locator('[data-home-widget="documents"]').count(),0);await page.locator('.home-hidden-widgets>summary').click();await page.getByRole('button',{name:'Mostrar',exact:true}).click();assert.equal(await page.locator('[data-home-widget="documents"]').count(),1);
 await page.locator('[data-home-widget="shop-h"] [data-home-resize]').press('ArrowRight');assert.equal(await page.locator('[data-home-widget="shop-h"]').evaluate(el=>el.style.getPropertyValue('--span')),'7');await page.getByRole('button',{name:'Deshacer',exact:true}).click();assert.equal(await page.locator('[data-home-widget="shop-h"]').evaluate(el=>el.style.getPropertyValue('--span')),'6');
 await page.locator('[data-home-widget="documents"] [data-home-grip]').dragTo(page.locator('[data-home-widget="price"]'));assert.ok((await page.locator('[data-home-widget]').evaluateAll(nodes=>nodes.map(n=>n.dataset.homeWidget))).indexOf('documents')<(await page.locator('[data-home-widget]').evaluateAll(nodes=>nodes.map(n=>n.dataset.homeWidget))).indexOf('price'));await page.getByRole('button',{name:'Deshacer',exact:true}).click();
 await page.locator('[data-home-command="panel-board"]').first().click();await page.locator('[data-home-general="gap"]').selectOption('12');assert.equal(await page.locator('.home-widget-grid').evaluate(el=>el.style.gap),'12px');await page.getByRole('button',{name:'Deshacer',exact:true}).click();assert.notEqual(await page.locator('.home-widget-grid').evaluate(el=>el.style.gap),'12px');
 const beforeMove=await page.locator('[data-home-widget]').evaluateAll(nodes=>nodes.map(n=>n.dataset.homeWidget));
 await page.locator('[data-home-widget="activity"] [data-home-command="up"]').click();assert.notDeepEqual(await page.locator('[data-home-widget]').evaluateAll(nodes=>nodes.map(n=>n.dataset.homeWidget)),beforeMove);await page.getByRole('button',{name:'Deshacer',exact:true}).click();await page.getByRole('button',{name:'Rehacer',exact:true}).click();await page.locator('[data-home-widget="activity"] [data-home-command="down"]').click();assert.deepEqual(await page.locator('[data-home-widget]').evaluateAll(nodes=>nodes.map(n=>n.dataset.homeWidget)),beforeMove);
 await page.locator('[data-home-widget="shop-h"] [data-home-command="select"]').click();
 await page.locator('[data-home-config="width"]').selectOption('12');
 assert.equal(await page.evaluate(()=>window.api.hasUnsaved()),true);
 await page.locator('[data-home-command="save"]').first().click();
 await page.waitForFunction(()=>!window.api.hasUnsaved());
 assert.deepEqual(errors,[]);
 for(const width of [1600,1100,600,390]){await page.setViewportSize({width,height:1000});const overflow=await page.locator('.home-widget-grid').evaluate(el=>el.scrollWidth>el.clientWidth+2);if(overflow)console.log(await page.locator('.home-widget-grid').evaluate(el=>({grid:[el.clientWidth,el.scrollWidth],children:[...el.children].map(n=>({id:n.dataset.homeWidget,width:n.clientWidth,scroll:n.scrollWidth})).filter(n=>n.scroll>n.width+2)})));assert.equal(overflow,false,'Sin desbordamiento del tablero a '+width);}

 await page.evaluate(async()=>{const {applyInterfaceAppearance}=await import('../src/appearance-ui.js');applyInterfaceAppearance({theme:'dark',card:'#172230',surface:'#263849',text:'#eeeeee',primary:'#aabbcc',borderColor:'#aabbcc',borderWidth:3,borderStrength:24,radius:24,shadow:'strong',cardGlow:8,fontSize:18,inputBackground:'#112233'});});
 await page.setViewportSize({width:1600,height:1000});
 await page.locator('[data-home-widget="gain-summary"] .field-help>summary').click();assert.equal(await page.locator('[data-home-widget="gain-summary"] .field-help').getAttribute('open'),'');await page.keyboard.press('Escape');assert.equal(await page.locator('[data-home-widget="gain-summary"] .field-help').getAttribute('open'),null);
 const themed=await page.locator('[data-home-widget]').evaluateAll(nodes=>nodes.map(el=>{const s=getComputedStyle(el);return {id:el.dataset.homeWidget,bg:s.backgroundColor,radius:s.borderRadius,border:s.borderTopWidth,shadow:s.boxShadow};}));
 assert.equal(themed.length,20);for(const widget of themed){assert.equal(widget.bg,'rgb(23, 34, 48)',widget.id+' fondo');assert.equal(widget.radius,'24px',widget.id+' radio');assert.equal(widget.border,'3px',widget.id+' borde');assert.notEqual(widget.shadow,'none',widget.id+' sombra');}
 assert.equal(await page.locator('[data-home-widget="activity"] select').first().evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(17, 34, 51)');
 console.log('PASS: producción y su resumen: 20 widgets; selectores físicos/online; configuración de los 20; periodos; consulta sin falso guardado; detalle de ticket; búsqueda; actualización; guardado con lectura posterior.');
}finally{await browser.close();}
