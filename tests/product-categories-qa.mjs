import assert from 'node:assert/strict';
import {test} from 'node:test';
import {categoryFields,categoryHierarchy,categoryDescendants} from '../src/product-categories-core.js';
import {createCategorySession} from '../src/product-categories-session.js';
import {synchronizeCategories} from '../supabase/functions/totus-connections/central-category-sync.js';
import {writeContactDirectory} from '../supabase/functions/totus-connections/contact-directory-write.js';
import {directoryXmlField} from '../src/productos-write-contract.js';
const rows=[{id:'1',id_parent:'0',name:'Raíz',active:'1'},{id:'2',id_parent:'1',name:'Inicio',active:'1',is_root_category:'1'},{id:'3',id_parent:'2',name:'Hija',active:'1'}];
test('hierarchy keeps parents, search ancestors and prohibits cycles and foreign parents',()=>{
 assert.deepEqual(categoryHierarchy(rows,{query:'Hija'}).map(r=>r.id),['1','2','3']);assert.deepEqual([...categoryDescendants(rows,'2')],['2','3']);
 assert.throws(()=>categoryFields({name:'Inicio',active:'1',id_parent:'3'},rows,{id:'2'}));
 assert.throws(()=>categoryFields({name:'Nueva',active:'1',id_parent:'999'},rows));
 assert.throws(()=>categoryHierarchy([{id:'1',id_parent:'2'},{id:'2',id_parent:'1'}]));
 assert.equal(categoryFields({name:'Física',active:'1',id_parent:'0'},[],{physical:true}).id_parent,'0');
});
test('a late response cannot load categories into another selected store',async()=>{
 let resolve;const session=createCategorySession({actor:()=> 'actor',can:()=>true,invoke:async()=>{},rpc:async(_name,{p_store})=>p_store==='a'?await new Promise(r=>resolve=r):{storeId:'b',items:[],languages:[],revision:0}});
 const first=session.load('a');await session.load('b');resolve({storeId:'a',items:rows,languages:[],revision:0});await assert.rejects(first,/tienda ha cambiado/);assert.equal(session.context.storeId,'b');
});
test('synchronization pins the website, verifies a stable complete hierarchy and saves server-side',async()=>{
 let writes=0,reads=0;const scoped={rpc:async()=>({data:{storeId:'store-a',website:'web-a',connectionId:'conn',connectionRevision:4,token:'ticket',connected:true}})};
 const admin={rpc:async(name,args)=>{assert.equal(name,'totus_category_snapshot_finish');assert.equal(args.p_token,'ticket');assert.deepEqual(args.p_items,rows);writes++;return {data:{storeId:'store-a',verified:true}};}};
 const dispatch=async q=>{assert.equal(q.store,'web-a');assert.equal(q.revision,4);reads++;return {ok:true,body:{ok:true,store:q.store,resource:q.resource,page:q.page,possibly_more:false,rows:q.resource==='languages'?[{id:'2',active:'1',iso_code:'es'}]:rows}};};
 await synchronizeCategories({store:'store-a',scoped,admin,dispatch});assert.equal(writes,1);assert.equal(reads,3);
 writes=0;await assert.rejects(synchronizeCategories({store:'store-a',scoped,admin,dispatch:async q=>{const r=await dispatch(q);r.body.store='other';return r;}}));assert.equal(writes,0);
 let count=0;await assert.rejects(synchronizeCategories({store:'store-a',scoped,admin,dispatch:async q=>{const r=await dispatch(q);if(q.resource==='categories'&&++count===2)r.body.rows=[...rows,{id:'4',id_parent:'2',name:'Cambio externo'}];return r;}}),/han cambiado/);assert.equal(writes,0);
});
const id='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const c={id,store_key:'web-fixture',website_name:'Tienda fixture',website_origin:'https://shop.example.com',protocol:'prestashop',endpoint:'https://shop.example.com/api',secret:'fixture',enabled:true,revision:1,verified_revision:1,real_data_authorized:true};
const resolve=async()=>['8.8.8.8'];
const localized=(name,a,b)=>'<'+name+'><language id="1"><![CDATA['+a+']]></language><language id="2"><![CDATA['+b+']]></language></'+name+'>';
test('native subcategory creation derives its native shop from the selected parent and replays once',async()=>{
 let created='',posts=0,entry=null;
 const request=async(address,init)=>{const u=new URL(address);
  if(u.pathname.endsWith('/languages'))return Response.json({languages:[{id:'1',iso_code:'en',active:'0'},{id:'2',iso_code:'es',active:'1'}]});
  if(init.method==='POST'){posts++;assert.equal(directoryXmlField(init.body,'categories','id_shop_default'),'1');assert.equal(directoryXmlField(init.body,'categories','id_parent'),'2');created=init.body.replace('<id></id>','<id>4</id>');return new Response(created,{status:201});}
  if(u.pathname.endsWith('/4'))return new Response(created);
  if(u.pathname.endsWith('/2'))return new Response('<prestashop><category><id>2</id><id_shop_default>1</id_shop_default></category></prestashop>');
  const filter=u.searchParams.get('filter[id]');if(filter==='[2]')return Response.json({categories:[{id:'2'}]});
  return Response.json({categories:created?[{id:'4',name:'Nueva',id_parent:'2'}]:[]});
 };
 const journal={lookup:async()=>entry,claim:async(_s,_id,meta)=>{entry={status:'pending',baseline_ids:meta.baseline_ids};return {status:'claimed'};},complete:async(_s,id)=>{entry={...entry,status:'completed',record_id:id};},uncertain:async()=>{entry={...entry,status:'uncertain'};}};
 const input={action:'prestashop_directory_prepare',kind:'categorias',store:'web-fixture',id,call_id:id,request_id:id,revision:1,resource:'categories',operation:'create',fields:{name:'Nueva',id_parent:'2',active:'1',link_rewrite:'nueva'}};
 const prepared=await writeContactDirectory(c,input,{request,resolve,journal}),commit={...input,action:'prestashop_directory_commit',confirmed:true,fingerprint:prepared.fingerprint};
 const result=await writeContactDirectory(c,commit,{request,resolve,journal});assert.equal(result.record_id,'4');assert.equal(posts,1);assert((await writeContactDirectory(c,commit,{request,resolve,journal})).replayed);assert.equal(posts,1);
});
test('native category update preserves other languages and product associations, rereads and replays once',async()=>{
 let xml='<prestashop><category><id>3</id><id_parent>2</id_parent><id_shop_default>1</id_shop_default><is_root_category>0</is_root_category><active>1</active><position>0</position>'+localized('name','English name','Nombre anterior')+localized('link_rewrite','english-name','nombre-anterior')+'<associations><products><product><id>50</id></product></products><categories/></associations></category></prestashop>',writes=0,entry=null;
 const schema='<prestashop><category><id/><id_parent/><id_shop_default/><is_root_category/><active/><position/><level_depth readOnly="true"/><name/><link_rewrite/><associations><products><product><id/></product></products><categories><category><id/></category></categories></associations></category></prestashop>';
 const request=async(address,init)=>{const u=new URL(address);if(u.searchParams.has('schema'))return new Response(schema);if(u.pathname.endsWith('/languages'))return Response.json({languages:[{id:'1',iso_code:'en',active:'0'},{id:'2',iso_code:'es',active:'1'}]});if(init.method==='PUT'){writes++;assert(init.body.includes('English name'));assert(init.body.includes('<id>50</id>'));assert(!init.body.includes('level_depth'));xml=init.body;return new Response('');}if(u.pathname.endsWith('/2'))return new Response('<prestashop><category><id>2</id><id_parent>1</id_parent></category></prestashop>');if(u.pathname.endsWith('/1'))return new Response('<prestashop><category><id>1</id><id_parent>0</id_parent></category></prestashop>');return new Response(xml);};
 const journal={lookup:async()=>entry,claim:async()=>{entry={status:'pending'};return {status:'claimed'};},complete:async()=>{entry={status:'completed'};},uncertain:async()=>{entry={status:'uncertain'};}};
 const input={action:'prestashop_directory_prepare',kind:'categorias',store:'web-fixture',id,call_id:id,request_id:id,revision:1,resource:'categories',operation:'update',record_id:'3',fields:{name:'Nombre nuevo',id_parent:'2'}};
 const prepared=await writeContactDirectory(c,input,{request,resolve,journal});assert(prepared.can_commit);
 const commit={...input,action:'prestashop_directory_commit',confirmed:true,fingerprint:prepared.fingerprint};const result=await writeContactDirectory(c,commit,{request,resolve,journal});assert(result.verified);assert.equal(writes,1);assert(xml.includes('Nombre nuevo'));assert((await writeContactDirectory(c,commit,{request,resolve,journal})).replayed);assert.equal(writes,1);
});
