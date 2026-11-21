import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:1600,height:1000}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4199/tests/chat-harness.html');
 await page.addStyleTag({url:'http://127.0.0.1:4199/src/appearance.css'});await page.addStyleTag({url:'http://127.0.0.1:4199/src/home-widgets.css'});
 await page.evaluate(async()=>{
  window.supabase={createClient:()=>({})};
  const {state}=await import('../src/state.js'),{createHomeWidgetsUI}=await import('../src/home-widgets-ui.js'),{homeToday}=await import('../src/home-period.js');
  const today=homeToday();state.data.settings={};state.user={id:'owner',role:'admin'};state.route='inicio';state.data.stores=[{id:'local',name:'Tienda física'},{id:'web',name:'Tienda online'}];state.data.expenses=[];state.data.closings=[];
  const {inicio}=await import('../src/pages/main.js');document.body.innerHTML='<main>'+inicio()+'</main>';
  let saved=null,revision=0;window.calls=[];window.api=createHomeWidgetsUI({rpc:async(name,p)=>{
   window.calls.push({name,p});
   if(name==='totus_home_dashboard'){if(p.p_action==='save'){saved=p.p_layout;revision++;}return {layout:saved,revision};}
   if(name==='totus_home_tpv_summary')return {storeId:p.p_store,from:p.p_from,to:p.p_to,source:'totustpv',salesCents:p.p_store==='local'?1000:2000,refundCents:200,saleCount:1,refundCount:1,marginCents:300,marginComplete:true,top:[{id:'product',name:'Artículo '+p.p_store,quantity:1}],series:[{date:today,salesCents:800,orders:1}]};
   if(name==='totus_local_store_workspace')return {storeId:p.p_store,items:p.p_kind==='sales'?[{id:p.p_store+'-sale',store_id:p.p_store,created_at:today+'T12:00:00Z',total_cents:p.p_store==='local'?1000:2000,payments:[{method:'card'}],refunds:[],snapshot:{customerName:'Cliente '+p.p_store,lines:[{productId:'product',name:'Artículo '+p.p_store,qty:1,totalCents:1000,netCents:826}]}}]:[]};
   return {rows:[]};
  },invoke:()=>{throw Error('No se permite consultar una web para los datos nativos.');},can:()=>true});window.api.mount(document.body);
 });
 await page.waitForFunction(()=>document.querySelector('[data-home-widget="orders"]')?.textContent.includes('Artículo local'),null,{timeout:5000}).catch(async e=>{console.log(await page.evaluate(()=>({calls:window.calls,body:document.body.innerText})),errors);throw e;});
 const expected=['opening','income','expense','result','internal','gain-summary','activity','shop-h','shop-n','orders','tasks','store','price','documents','expense-quarter','billing','fiscal','system','gain','recent-closings','quick-links'];
 assert.deepEqual(await page.locator('[data-home-widget]').evaluateAll(nodes=>nodes.map(n=>n.dataset.homeWidget)),expected);
 assert.equal(await page.evaluate(()=>window.api.hasUnsaved()),false);
 assert.match(await page.locator('[data-home-widget="shop-h"]').innerText(),/8,00/);
 assert.match(await page.locator('[data-home-widget="shop-n"]').innerText(),/18,00/);
 assert.equal(await page.locator('[data-home-widget="activity"] .activity-chart svg').count(),1);
 for(const id of ['store','documents','expense-quarter','billing','fiscal']){await page.locator(`[data-home-widget="${id}"] [data-home-filter="store"]`).selectOption('web');assert.equal(await page.locator(`[data-home-widget="${id}"] [data-home-filter="store"]`).inputValue(),'web');}
 for(const id of expected){
  await page.locator(`[data-home-widget="${id}"] [data-home-command="select"]`).click();
  assert.equal(await page.locator('[data-home-config="width"]').count(),1,`Configuración de ${id}`);
  await page.getByRole('button',{name:'Cancelar edición',exact:true}).click();
 }
 console.log('AFTER CONFIG',await page.evaluate(()=>({edit:document.querySelector('.dashboard-page').className,dirty:window.api.hasUnsaved()})));
 const activity=page.locator('[data-home-widget="activity"]');
 await activity.locator('[data-home-command="period-week"]').click();
 assert.equal(await activity.locator('[data-home-command="period-week"]').getAttribute('aria-pressed'),'true');
 await activity.locator('[data-home-filter="store"]').selectOption('web');
 await page.waitForFunction(()=>document.querySelector('[data-home-widget="activity"] [data-home-filter="store"]')?.value==='web');
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
 for(const id of ['shop-h','shop-n','orders','gain']){
  await page.locator(`[data-home-widget="${id}"] [data-home-command="fetch"]`).first().click();
 }
 assert.equal(await page.evaluate(()=>window.api.hasUnsaved()),false);
 await page.getByRole('button',{name:'Personalizar inicio'}).click();
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
 assert.equal(themed.length,21);for(const widget of themed){assert.equal(widget.bg,'rgb(23, 34, 48)',widget.id+' fondo');assert.equal(widget.radius,'24px',widget.id+' radio');assert.equal(widget.border,'3px',widget.id+' borde');assert.notEqual(widget.shadow,'none',widget.id+' sombra');}
 assert.equal(await page.locator('[data-home-widget="activity"] select').first().evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(17, 34, 51)');
 console.log('PASS: producción y su resumen: 21 widgets; selectores físicos/online; configuración de los 21; periodos; consulta sin falso guardado; detalle de ticket; búsqueda; actualización; guardado con lectura posterior.');
}finally{await browser.close();}
