import test from 'node:test';import assert from 'node:assert/strict';
import {createLocalTpvAdapter} from '../src/totustpv/local-adapter.js';
import {localCategories,categoryFilterIds} from '../src/totustpv/local-categories.js';
const categories=[{id:1,parentId:0,name:'Raíz',root:true,active:true},{id:2,parentId:1,name:'Semillas',root:false,active:true},{id:3,parentId:2,name:'Marca',root:false,active:true},{id:4,parentId:1,name:'Inactiva',active:false}];
test('categories retain hierarchy, hide inactive/root rows and include descendants',()=>{
 assert.deepEqual(localCategories(categories).map(c=>c.label),['Semillas','Semillas / Marca']);assert.deepEqual([...categoryFilterIds(categories,2)],[2,3]);
 assert.throws(()=>localCategories([{id:1,parentId:2,name:'A',active:true},{id:2,parentId:1,name:'B',active:true}]));
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
