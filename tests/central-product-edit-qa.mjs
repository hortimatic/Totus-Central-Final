import assert from 'node:assert/strict';
import {centralProductEditPayload} from '../src/central-product-edit.js';
const store='00000000-0000-0000-0000-000000000001',id='00000000-0000-0000-0000-000000000002',a='00000000-0000-0000-0000-000000000003',b='00000000-0000-0000-0000-000000000004';
const product={id,store_id:store,name:'Bolsa',sku:'BOLSA',updated_at:'2026-11-21T00:00:00Z',notes:'Keep notes',brand_id:null,supplier_id:null,
 details:{defaultVariantId:b,ean:'0012345678901',metaTitle:'Título',sourceData:{name:[{id:'1',value:'Bolsa'},{id:'2',value:'Bag'}],description:[{id:'1',value:'ES'},{id:'2',value:'EN'}],weight:'0.5',associations:{images:[{id:'5'}]}},unknown:{preserve:true}},
 variants:[{id:a,sku:'SMALL',attributes:{Talla:'Pequeña'},cost_net:'2.50',active:true},{id:b,sku:'LARGE',attributes:{Talla:'Grande'},active:true}],
 catalogue:[{id:a,variant_id:a,price_cents:500,tax_basis_points:2100,stock:3,revision:8,quantity_unit:'unit',ean:'1111111111111',active:true},{id:b,variant_id:b,price_cents:700,tax_basis_points:2100,stock:11,revision:9,quantity_unit:'unit',ean:'2222222222222',active:true}]};
const original=structuredClone(product);
const edit=(changes,resource='products',rid=id)=>centralProductEditPayload(product,resource,rid,changes);
const name=edit([{field:'name',language_id:'2',value:'New bag'}]);
assert.equal(name.payload.name,'Bolsa','A secondary language never overwrites the primary visible name');assert.equal(name.payload.sourceData.name[0].value,'Bolsa');assert.equal(name.payload.sourceData.name[1].value,'New bag');
assert.deepEqual(name.payload.unknown,{preserve:true});assert.deepEqual(name.payload.sourceData.associations,{images:[{id:'5'}]});assert.equal(name.payload.notes,'Keep notes');assert.equal(name.payload.ean,'0012345678901');
assert.equal(name.payload.variants[0].ean,'1111111111111');assert.equal(name.payload.variants[1].ean,'2222222222222');assert.equal(name.payload.variants[0].stock,3);assert.equal(name.payload.variants[1].stock,11);assert.equal(name.payload.variants[0].costNet,'2.50');
assert.deepEqual(name.payload.catalogueRevisions,{[a]:8,[b]:9});assert.equal(name.payload.expectedRevision,product.updated_at);
const renamed=edit([{field:'name',language_id:'1',value:'Bolsa nueva'},{field:'meta_title',language_id:'1',value:'SEO nuevo'}]);assert.equal(renamed.payload.name,'Bolsa nueva');assert.equal(renamed.payload.metaTitle,'SEO nuevo');assert.equal(renamed.payload.sourceData.name[1].value,'Bag');
const price=edit([{field:'price',value:'10.000000'}]);assert.equal(price.payload.priceCents,1210);assert.deepEqual(price.payload.variants.map(v=>v.priceCents),[1010,1210],'A base-price edit preserves combination impacts and exact final cents');
const variant=edit([{field:'price',value:'-1.652893'},{field:'wholesale_price',value:'3.250000'},{field:'ean13',value:'9999999999999'},{field:'weight',value:'0.75'}],'combinations',a);
assert.equal(variant.payload.variants[0].priceCents,500);assert.equal(variant.payload.variants[0].costNet,'3.250000');assert.equal(variant.payload.variants[0].ean,'9999999999999');assert.equal(variant.payload.copyVariantMetadata[a].weight,'0.75');assert.equal(variant.payload.variants[1].priceCents,700);assert.equal(variant.payload.ean,'0012345678901');
const archive=edit([{field:'active',value:'0'}]);assert.equal(archive.payload.active,false);assert.ok(archive.payload.variants.every(v=>!v.active));
assert.throws(()=>edit([{field:'id_supplier',value:'1'}]),/admitido/);assert.throws(()=>edit([{field:'name',language_id:'3',value:'Unknown'}]),/idioma/);assert.throws(()=>edit([{field:'price',value:'1.2345678'}]),/Importe/);assert.throws(()=>edit([{field:'price',value:'-2'}]),/Importe/);
assert.throws(()=>edit([{field:'price',value:'-20'}],'combinations',a),/precio final/);assert.throws(()=>edit([{field:'reference',value:'X'}],'combinations',crypto.randomUUID()),/pertenece/);
assert.deepEqual(product,original,'Payload construction never mutates the saved source snapshot');
console.log('Native edit payload: primary/secondary languages, full metadata preservation, own references, independent EANs, catalogue CAS, combination net impacts and exact final prices verified.');
