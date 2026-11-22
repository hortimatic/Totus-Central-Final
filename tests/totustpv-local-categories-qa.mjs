import test from 'node:test';import assert from 'node:assert/strict';
import {createLocalTpvAdapter} from '../src/totustpv/local-adapter.js';
import {localCategories,categoryFilterIds} from '../src/totustpv/local-categories.js';
const categories=[{id:1,parentId:0,name:'Raíz',root:true,active:true},{id:2,parentId:1,name:'Semillas',root:false,active:true},{id:3,parentId:2,name:'Marca',root:false,active:true},{id:4,parentId:1,name:'Inactiva',active:false}];
test('categories retain hierarchy, hide inactive/root rows and include descendants',()=>{
 assert.deepEqual(localCategories(categories).map(c=>c.label),['Semillas','Semillas / Marca']);assert.deepEqual([...categoryFilterIds(categories,2)],[2,3]);
 assert.throws(()=>localCategories([{id:1,parentId:2,name:'A',active:true},{id:2,parentId:1,name:'B',active:true}]));
});
test('large local catalogues sort and filter before paging and never render thousands of cards',async()=>{
 const items=Array.from({length:85},(_,i)=>({id:String(i+1),product_id:String(i+1),name:'Artículo '+String(85-i).padStart(3,'0'),reference:'REF-'+i,price_cents:100,tax_basis_points:0,stock:1,metadata:{categoryId:i<50?2:3,categoryIds:[]}}));
 const adapter=createLocalTpvAdapter({actorId:'actor',currentActor:()=> 'actor',storage:{getItem:()=>null},invoke:async(name)=>{
  if(name==='totus_tpv_local_context')return {actorId:'actor',drawers:[{id:'drawer',storeId:'shop',storeName:'Tienda'}],sessions:[{id:'session',drawerId:'drawer',storeId:'shop',status:'open'}]};
  if(name==='totus_tpv_local_read')return {items,hasMore:false};if(name==='totus_tpv_local_categories')return {storeId:'shop',categories};throw Error(name);
 }});
 const context=await adapter.context();await adapter.selectSession(context.sessions[0]);await adapter.categories();
 const first=await adapter.searchProducts(),second=await adapter.searchProducts({page:1}),last=await adapter.searchProducts({page:2});
 assert.equal(first.length,40);assert.equal(first.totalCount,85);assert.equal(first[0].name,'Artículo 001');assert(first.hasMore);assert.equal(second.length,40);assert.equal(last.length,5);assert.equal(last.hasMore,false);assert.equal(new Set([...first,...second,...last].map(p=>p.id)).size,85);
 const filtered=await adapter.searchProducts({categoryId:3});assert.equal(filtered.totalCount,35);assert.equal(filtered.length,35);assert.equal(filtered.hasMore,false);
});
test('the POS reads the selected store categories and filters primary/multiple memberships and parent categories',async()=>{
 let categoryStore='shop';const products=[{id:'a',product_id:'p',name:'Hija',reference:'A',price_cents:121,tax_basis_points:2100,stock:1,metadata:{categoryId:3,categoryIds:[3]}},{id:'b',product_id:'q',name:'Otra',reference:'B',price_cents:121,tax_basis_points:2100,stock:1,metadata:{categoryId:4,categoryIds:[4,3]}}];
 const adapter=createLocalTpvAdapter({actorId:'admin',currentActor:()=> 'admin',storage:{getItem:()=>null},invoke:async(name,args)=>{
  if(name==='totus_tpv_local_context')return {actorId:'admin',drawers:[{id:'drawer',storeId:'shop',storeName:'Tienda'}],sessions:[{id:'session',drawerId:'drawer',storeId:'shop',status:'open'}]};
  if(name==='totus_tpv_local_categories'){assert.equal(args.p_drawer,'drawer');return {storeId:categoryStore,categories};}
  if(name==='totus_tpv_local_read')return {items:products,hasMore:false};throw Error(name);
 }});
 const context=await adapter.context();await adapter.selectSession(context.sessions[0]);assert.equal((await adapter.categories()).length,2);
 assert.equal((await adapter.searchProducts({categoryId:2})).length,2);assert.equal((await adapter.searchProducts({categoryId:3})).length,2);
 assert.equal((await adapter.searchProducts({catalogueFilters:{excludedCategories:[2]}})).length,0);
 categoryStore='other';await assert.rejects(adapter.categories(),/tienda o la caja/);
});
