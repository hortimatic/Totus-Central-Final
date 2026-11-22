import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir} from 'node:fs/promises';
const browser=await chromium.launch({headless:true}),page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto('http://127.0.0.1:4173/tests/chat-harness.html');
 await page.evaluate(async()=>{
  const {createTasks}=await import('../src/tasks-ui.js');const {taskToday}=await import('../src/tasks-core.js');
  document.head.insertAdjacentHTML('beforeend','<link rel="stylesheet" href="../src/tasks.css">');
  window.calls=[];window.confirmations=[];window.rows=[{task_id:'t1',scheduled_on:taskToday(),starts_on:taskToday(),ends_on:null,repeat_kind:'daily',repeat_every:1,weekdays:[],checklist:['Contar'],checked:[],title:'Revisar Vape',description:'Caja de tienda',state:'pending',store_id:'h',assigned_email:'a@qa.invalid',priority:'high',can_manage:true,task_version:'v1',occurrence_version:null}];
  window.controller=createTasks({actor:()=> 'a@qa.invalid',confirm:async message=>{window.confirmations.push(message);return true;},onError:e=>{window.lastError=e;},rpc:async(name,args)=>{
   window.calls.push({name,args});
   if(name==='totus_tasks_context')return {rows:window.rows,archived_tasks:window.archivedRows||[],deleted_tasks:window.deletedRows||[],stores:[{id:'h',name:'Hortimatic'},{id:'n',name:'NewOldSmok'}],people:[{email:'a@qa.invalid',name:'Diego'}]};
   if(name==='totus_task_remove'){if(args.p_restore){window.archivedRows=window.deletedRows;window.deletedRows=[];}else{window.deletedRows=window.archivedRows;window.archivedRows=[];}return {id:args.p_task_id,deleted:!args.p_restore};}
   if(name==='totus_task_purge'){if(window.purgeError)throw Error(window.purgeError);window.deletedRows=window.deletedRows.filter(t=>t.task_id!==args.p_task_id);return {id:args.p_task_id,purged:true};}
   if(name==='totus_task_from_message')return null;
   if(name==='totus_task_history')return [];
   if(name==='totus_task_command'){if(args.p_action==='archive'&&args.p_data.archived===false)window.archivedRows=[];return {id:'t1'};}
   throw new Error(name);
  }});await window.controller.mount(document.getElementById('chatHarness'));
 });
 await page.waitForFunction(()=>{const input=document.querySelector('.tasks-filters select');return input&&getComputedStyle(input).borderRadius==='10px'&&input.getBoundingClientRect().height>=40;});
 // Interactivity inspired by calendar day links, overflow agendas and keyboard navigation.
 await page.getByRole('button',{name:'Día',exact:true}).click();assert.equal(await page.locator('.task-day').count(),1);
 await page.getByRole('button',{name:'Siguiente',exact:true}).click();await page.getByRole('button',{name:'Hoy',exact:true}).click();
 await page.locator('[data-task-anchor]').fill('2027-02-28');await page.locator('[data-task-anchor]').press('Tab');assert.equal(await page.locator('[data-task-anchor]').inputValue(),'2027-02-28');
 await page.getByRole('button',{name:'Hoy',exact:true}).click();await page.getByRole('button',{name:'Mes',exact:true}).click();
 await page.locator('[data-task="today"]').focus();await page.keyboard.press('d');assert.equal(await page.locator('.task-day').count(),1);await page.keyboard.press('m');
 await page.evaluate(()=>{window.originalRows=window.rows;window.rows=Array.from({length:5},(_,i)=>({...window.originalRows[0],task_id:'busy-'+i,title:'Tarea '+i}));});await page.locator('[data-task="refresh"]').click();
 assert.equal(await page.locator('.tasks-calendar .task-chip').count(),3);await page.getByRole('button',{name:'Ver 2 más',exact:true}).click();assert.equal(await page.locator('dialog .task-chip').count(),5);await page.getByRole('button',{name:'Cancelar',exact:true}).click();
 await page.locator('.task-day.today [data-task="day-view"]').click();assert.equal(await page.locator('.task-day').count(),1);assert.equal(await page.locator('.task-chip').count(),5);
 await page.getByRole('button',{name:'Lista',exact:true}).click();assert.equal(await page.locator('.task-agenda-group').count(),1);
 await page.evaluate(()=>window.rows=window.originalRows);await page.getByRole('button',{name:'Mes',exact:true}).click();
 await page.getByRole('button',{name:/Revisar Vape/}).click();
 await page.locator('dialog [name="state"]').selectOption('done');
 await page.getByRole('checkbox',{name:'Contar',exact:true}).check();
 await page.getByRole('button',{name:'Guardar',exact:true}).click();
 assert(await page.evaluate(()=>window.calls.some(c=>c.name==='totus_task_command'&&c.args.p_action==='occurrence'&&c.args.p_data.checked[0]===0)));
 await page.getByRole('button',{name:'Nueva tarea',exact:true}).click();
 await page.getByLabel('Título',{exact:true}).fill('Limpieza mensual');
 await page.locator('dialog [name="repeat_kind"]').selectOption('weekly');
 assert(await page.getByText('Lunes',{exact:true}).last().isVisible());
 await page.getByLabel('Título',{exact:true}).fill('Prueba semanal');
 await page.getByRole('button',{name:'Guardar',exact:true}).click();
 assert(await page.evaluate(()=>window.calls.some(c=>c.name==='totus_task_command'&&c.args.p_action==='save'&&c.args.p_data.task.title==='Prueba semanal'&&c.args.p_data.client_id)));
 // Opening a new dialog after closing the previous one must never remove the new dialog.
 await page.getByRole('button',{name:/Revisar Vape/}).click();
 await page.getByRole('button',{name:'Editar configuración'}).click();
 await page.waitForTimeout(100);
 assert(await page.getByRole('heading',{name:'Editar tarea',exact:true}).isVisible());
 assert(await page.locator('dialog [name="store_id"]').isDisabled());
 await page.locator('dialog [name="scope"]').selectOption('future');
 assert(await page.locator('dialog [name="store_id"]').isEnabled());
 await page.getByRole('button',{name:'Cancelar',exact:true}).click();
 await page.getByRole('button',{name:'Lista',exact:true}).click();
 assert(await page.locator('.tasks-list').isVisible());
 await page.locator('[data-filter="store"]').selectOption('n');
 await page.getByRole('button',{name:'Aplicar',exact:true}).click();
 assert.equal(await page.locator('.task-chip').count(),0);
 await page.getByRole('button',{name:'Limpiar',exact:true}).click();
 await page.getByRole('button',{name:'Semana',exact:true}).click();
 assert.equal(await page.locator('.task-day').count(),7);
 await page.getByRole('button',{name:/Revisar Vape/}).click();
 await page.locator('dialog [name="result"]').fill('Notas que todavía no he guardado');
 await page.getByRole('button',{name:'Historial',exact:true}).click();
 assert(await page.getByRole('heading',{name:'Historial de la tarea',exact:true}).isVisible());
 assert(await page.evaluate(()=>window.confirmations.some(m=>m.includes('cambios sin guardar'))),'History must not silently discard task notes');
 await page.getByRole('button',{name:'Cancelar',exact:true}).click();
 await page.getByRole('button',{name:/Revisar Vape/}).click();
 await page.getByRole('button',{name:'Archivar tarea',exact:true}).click();
 assert(await page.evaluate(()=>window.calls.some(c=>c.name==='totus_task_command'&&c.args.p_action==='archive')));
 const range=()=>page.evaluate(()=>window.calls.filter(c=>c.name==='totus_tasks_context').at(-1).args);
 const beforeRange=await range();
 await page.locator('[data-task="next"]').click();await page.waitForFunction(from=>window.calls.filter(c=>c.name==='totus_tasks_context').at(-1).args.p_from!==from,beforeRange.p_from);
 assert((await range()).p_from>beforeRange.p_from,'Next must request a later calendar range');
 await page.locator('[data-task="prev"]').click();await page.waitForFunction(from=>window.calls.filter(c=>c.name==='totus_tasks_context').at(-1).args.p_from===from,beforeRange.p_from);
 await page.locator('[data-task="today"]').click();
 await page.locator('[data-task="mine"]').click();assert.equal(await page.locator('[data-filter="person"]').inputValue(),'a@qa.invalid');
 await page.evaluate(()=>window.archivedRows=[{task_id:'archived-qa',title:'Tarea archivada ficticia',task_version:'v1',can_manage:true}]);
 await page.locator('[data-task="refresh"]').click();
 await page.locator('[data-task="archived"]').click();await page.getByRole('heading',{name:'Tareas archivadas',exact:true}).waitFor();
 await page.locator('dialog [data-task="restore"]').click();
 assert(await page.evaluate(()=>window.calls.some(c=>c.name==='totus_task_command'&&c.args.p_action==='archive'&&c.args.p_data.task_id==='archived-qa'&&c.args.p_data.archived===false)));
 await page.locator('[data-task="archived"]').click();await page.getByText('No hay tareas archivadas.',{exact:true}).waitFor();
 await page.getByRole('button',{name:'Cancelar',exact:true}).click();
 await page.evaluate(()=>window.archivedRows=[{task_id:'remove-qa',title:'Eliminar y recuperar',task_version:'v2',can_manage:true}]);
 await page.locator('[data-task=refresh]').click();await page.locator('[data-task=archived]').click();await page.locator('[data-task=delete-archived]').click();
 await page.locator('[data-task=deleted]').click();await page.getByRole('heading',{name:'Tareas eliminadas',exact:true}).waitFor();await page.getByText('Eliminar y recuperar',{exact:true}).waitFor();await page.locator('[data-task=recover-deleted]').click();
 await page.locator('[data-task=archived]').click();await page.getByText('Eliminar y recuperar',{exact:true}).waitFor();await page.getByRole('button',{name:'Cancelar',exact:true}).click();
 assert(await page.evaluate(()=>window.calls.filter(c=>c.name==='totus_task_remove').length===2));
 await page.evaluate(()=>window.deletedRows=[{task_id:'purge-qa',title:'Borrado definitivo ficticio',task_version:'v3',can_manage:true}]);
 await page.locator('[data-task=refresh]').click();await page.locator('[data-task=deleted]').click();await page.locator('[data-task=purge-deleted]').click();
 const purge=page.locator('[data-purge-confirm]');assert(await purge.isDisabled());
 await page.getByRole('button',{name:'Cancelar',exact:true}).click();assert(!(await page.evaluate(()=>window.calls.some(c=>c.name==='totus_task_purge'))));
 await page.locator('[data-task=deleted]').click();await page.locator('[data-task=purge-deleted]').click();await page.locator('[name=purge_confirmation]').fill('ELIMINAR TAREA');
 await page.evaluate(()=>window.purgeError='La tarea ha cambiado. Actualiza antes de continuar.');await page.locator('[data-purge-confirm]').click();await page.getByText('La tarea ha cambiado. Actualiza antes de continuar.',{exact:true}).waitFor();
 assert.equal(await page.evaluate(()=>window.deletedRows.length),1,'Failed purge remains in trash');
 await page.evaluate(()=>window.purgeError=null);await page.locator('[data-purge-confirm]').click();await page.locator('dialog').waitFor({state:'detached'});
 assert.equal(await page.evaluate(()=>window.deletedRows.length),0);assert(await page.evaluate(()=>window.calls.some(c=>c.name==='totus_task_purge'&&c.args.p_task_id==='purge-qa'&&c.args.p_task_version==='v3'&&c.args.p_confirmation==='ELIMINAR TAREA')));
 const day=await page.locator('[data-task="day-new"]').first().getAttribute('data-date');
 await page.locator('[data-task="day-new"]').first().click();assert.equal(await page.locator('dialog [name="starts_on"]').inputValue(),day);
 await page.getByRole('button',{name:'Cancelar',exact:true}).click();
 await mkdir('artifacts',{recursive:true});await page.screenshot({path:'artifacts/tasks-desktop.png',fullPage:true});
 for(const width of [1920,955,390]){
  await page.setViewportSize({width,height:900});
  // Reserve the real navigation width: standalone fixtures otherwise miss this defect.
  await page.locator('#chatHarness').evaluate((el,w)=>{el.style.width=(w>700?w-340:w-32)+'px';el.style.maxWidth='100%';},width);
  const geometry=await page.locator('.tasks-calendar').evaluate(el=>({width:el.clientWidth,scroll:el.scrollWidth,days:[...el.querySelectorAll('.task-day')].slice(0,7).map(n=>({left:n.getBoundingClientRect().left,right:n.getBoundingClientRect().right})),right:el.getBoundingClientRect().right}));
  assert(geometry.scroll<=geometry.width+1,'Los siete días caben sin desplazamiento horizontal a '+width);
  assert(geometry.days.every(d=>d.right<=geometry.right+1),'Domingo queda visible a '+width);
  assert(await page.locator('[data-task-anchor]').isVisible(),'Fecha accesible a '+width);
  const buttons=await page.locator('.tasks-toolbar .btn').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().height));assert(Math.max(...buttons)-Math.min(...buttons)<1,'Altura uniforme de botones a '+width);
  assert.equal(await page.getByRole('group',{name:'Vista del calendario',exact:true}).count(),1);
  assert.equal(await page.getByRole('group',{name:'Acciones de tareas',exact:true}).count(),1);
 }
 const overflow=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,wide:[...document.querySelectorAll('.tasks-module *')].filter(e=>e.getBoundingClientRect().right>innerWidth&&!e.closest('.tasks-calendar')).slice(0,8).map(e=>({tag:e.tagName,class:e.className,right:e.getBoundingClientRect().right}))}));assert(overflow.scroll<=overflow.width+1,JSON.stringify(overflow));
 await page.getByRole('button',{name:'Nueva tarea',exact:true}).click();
 assert(await page.evaluate(()=>{const r=document.querySelector('dialog').getBoundingClientRect();return r.width<=innerWidth&&r.bottom<=innerHeight;}));
 await page.screenshot({path:'artifacts/tasks-mobile.png',fullPage:true});
 assert.deepEqual(errors,[]);console.log('TASK BROWSER QA: create, repetition, state, checklist, edit dialog, filters, week/list, desktop and mobile OK');
}finally{await browser.close();}

