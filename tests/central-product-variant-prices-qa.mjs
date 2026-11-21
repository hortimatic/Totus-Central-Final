import assert from 'node:assert/strict';
import {centralProductRecord,centralCombinationRecord,createCentralProductAdapter,centralDefaultCatalogue} from '../src/central-product-adapter.js';
const id='00000000-0000-0000-0000-000000000001',a='00000000-0000-0000-0000-000000000002',b='00000000-0000-0000-0000-000000000003';
const variants=[{id:a,product_id:id,source_id:10,sku:'CHEAP',attributes:{Size:'Small'},cost_net:'2.35'},{id:b,product_id:id,source_id:20,sku:'DEFAULT',attributes:{Size:'Large'}}];
const p={id,name:'Own product',sku:'BASE',variants,details:{nativePrice:{attribute_id:20},sourceData:{ean13:'0012345678901'}},catalogue:[{variant_id:a,price_cents:1210,tax_basis_points:2100,ean:'1111111111111',active:true},{variant_id:b,price_cents:2420,tax_basis_points:2100,ean:'2222222222222',active:false}]};
assert.equal(centralDefaultCatalogue(p).variant_id,b,'Editor and catalogue share the same default variant');
assert.equal(centralProductRecord(p).price,'20.000000','The actual default variant, not the first sorted reference, supplies the displayed base price');
assert.equal(centralProductRecord(p).ean13,'0012345678901','A parent never inherits its default variant barcode');assert.equal(centralProductRecord(p).active,'1','An inactive default variant does not hide other saleable variants');
assert.equal(centralCombinationRecord(p,variants[0]).price,'-10.000000');assert.equal(centralCombinationRecord(p,variants[1]).price,'0.000000');
assert.equal(centralCombinationRecord(p,variants[0]).wholesale_price,'2.35');
const original={weight:'0.5',associations:{images:[{id:'8'}],product_option_values:[{id:'5'}]}};
assert.deepEqual(centralCombinationRecord(p,variants[0],original).associations,original.associations);assert.equal(centralCombinationRecord(p,variants[0],original).weight,'0.5');
for(const price of [1,2,99,100,101,1999,999999999])for(const tax of [0,400,1000,2100]){
 const simple={...p,variants:[],details:{},catalogue:[{price_cents:price,tax_basis_points:tax,active:true}]},net=centralProductRecord(simple).price;
 const micros=BigInt(net.replace('.','')),denominator=100000000n;
 const roundtrip=(micros*(10000n+BigInt(tax))+denominator/2n)/denominator;
 assert.equal(roundtrip,BigInt(price),`Gross/net roundtrip ${price}/${tax}`);
}
assert.throws(()=>centralProductRecord({...p,catalogue:[{price_cents:1.5,tax_basis_points:2100}]}),/verificado/);
console.log('Variant copy prices: verified default, signed net impacts, separate parent barcode, original image/attribute/measure metadata, exact integer roundtrips and invalid price rejection verified.');
const store='00000000-0000-0000-0000-000000000099';
const imported={...p,store_id:store,source_id:42,source_website:'web-a',variants:variants.map(v=>({...v,source_website:'web-a'}))};
let foreign=false;
const adapter=createCentralProductAdapter({actor:()=> 'owner',rpc:async(name,args)=>{
 if(args.p_kind==='context')return {stores:[{id:store,name:'Online'}]};
 if(name==='totus_local_store_workspace')return {storeId:store,items:[imported]};
 return {storeId:store,resource:'combinations',revision:1,website:'web-a',items:[{id:'10',id_product:foreign?'999':'42',...original},{id:'20',id_product:'42'}],nextCursor:null};
}});
await adapter.context();const projected=await adapter.read(store,'combinations',{id:a});assert.equal(projected.rows[0].price,'-10.000000');assert.equal(projected.rows[0].weight,'0.5');assert.equal(projected.rows[0].__sourceDetailsMissing,false);
foreign=true;adapter.invalidate(store);await assert.rejects(()=>adapter.read(store,'combinations'),/otro producto/);