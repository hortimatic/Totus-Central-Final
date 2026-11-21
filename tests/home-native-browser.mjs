import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch();
try{const p=await browser.newPage();await p.goto('http://127.0.0.1:4199/tests/chat-harness.html');
await p.evaluate(async()=>{window.supabase={createClient:()=>({})};const {state}=await import('../src/state.js');const {createHomeWidgetsUI}=await import('../src/home-widgets-ui.js');state.user={id:'u'};state.route='inicio';state.data.stores=[{id:'s',name:'Local'}];state.data.expenses=[];document.body.innerHTML='<main><div class="dashboard-page"></div></main>';createHomeWidgetsUI({rpc:async(name)=>name==='totus_home_dashboard'?{layout:null}:name==='totus_home_tpv_summary'?{storeId:'s',from:new Date().toISOString().slice(0,10),to:new Date().toISOString().slice(0,10),source:'totustpv'}:{},can:()=>true}).mount(document.body);});
await p.getByRole('button',{name:'Configurar Ganancias de las ventas'}).click();assert.ok(await p.locator('[data-home-config="width"]').count());
}finally{await browser.close();}
