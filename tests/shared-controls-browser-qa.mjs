import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true});
try{
 for(const width of [390,955,1920]){
  const page=await browser.newPage({viewport:{width,height:900}});
  await page.goto('http://127.0.0.1:4199/tests/chat-harness.html');
  await page.evaluate(async()=>{
   for(const name of ['styles.css','appearance.css','interface-controls.css','productos-professional.css','productos-stitch.css','contact-directory.css','tasks.css','totustpv/reference-interface.css']){const l=document.createElement('link');l.rel='stylesheet';l.href='../src/'+name;document.head.append(l);await new Promise((ok,fail)=>{l.onload=ok;l.onerror=fail;});}
   document.documentElement.dataset.appearance='custom';document.documentElement.style.setProperty('--appearance-button-radius','12px');
   document.body.innerHTML='<div id="app"><main id="content"><div class="inline-actions"><button class="btn primary" data-check>Guardar</button><button class="btn secondary" data-check>Cancelar</button></div><div id="productosRoot"><div class="prd-professional"><div class="prd-v4-nav"><div><button class="master-tab-btn" data-check>Catálogo</button></div></div><button class="prd-table-button" data-check>Abrir ficha</button><button class="subtab-btn" data-check>Precios</button></div></div><section class="tasks-module"><div class="tasks-toolbar"><button class="btn secondary" data-check>Actualizar</button></div></section><div class="form-grid"><label>Nombre<input value="Texto"></label><label>Tipo<select><option>General</option></select></label></div><button class="prd-photo-trigger" style="width:68px;height:68px">Imagen</button></main></div>';
   window.clicked=0;document.querySelectorAll('[data-check]').forEach(b=>b.onclick=()=>window.clicked++);
  });
  const controls=await page.locator('[data-check]').evaluateAll(nodes=>nodes.map(n=>{const s=getComputedStyle(n);return {height:n.getBoundingClientRect().height,font:s.fontSize,radius:s.borderRadius};}));
  for(const c of controls){assert.equal(c.height,width<=600?44:36);assert.equal(c.font,'13px');assert.equal(c.radius,'12px');}
  assert.equal(await page.locator('.prd-photo-trigger').evaluate(n=>n.getBoundingClientRect().height),68,'No modificar controles de imagen');
  await page.getByRole('button',{name:'Guardar',exact:true}).focus();await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>window.clicked),1);
  assert(await page.locator('.inline-actions').evaluate(n=>n.scrollWidth<=n.clientWidth+1),'Acciones sin desbordamiento');
  await page.close();
 }
 console.log('Shared actions: late module styles, personal radius, keyboard, responsive height and specialized image control PASS');
}finally{await browser.close();}
