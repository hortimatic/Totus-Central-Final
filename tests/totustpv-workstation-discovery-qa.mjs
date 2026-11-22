import assert from 'node:assert/strict';
import {discoverWorkstations} from '../src/totustpv/workstation-discovery.js';
import {workstationDialog} from '../src/totustpv/workstation-visual.js';
const current={stores:[{id:'a',name:'Existente'}],drawers:[{id:'d1',storeId:'a',name:'Caja autorizada',canSell:true}],sessions:[{id:'s1',drawerId:'d1'}]};
const setup={actorId:'admin',stores:[{id:'a',name:'Existente'},{id:'b',name:'Nueva web'}],drawers:[{id:'d1',storeId:'a',name:'Caja autorizada'},{id:'d2',storeId:'b',name:'Caja nueva'}]};
const found=discoverWorkstations(current,setup,'admin');assert.equal(found.stores.length,2);assert.equal(found.drawers.length,2);assert.equal(found.drawers[0].canSell,true);assert.equal(found.drawers[1].requiresSetup,true);assert.equal(found.drawers[1].canSell,false);assert.deepEqual(found.sessions,current.sessions);assert.equal(current.drawers.length,1);assert.throws(()=>discoverWorkstations(current,setup,'other'));
const html=workstationDialog({...found,storeId:'b',drawerId:'d2',userName:'Admin',canSwitchDrawer:true,open:true});assert.match(html,/Nueva web/);assert.match(html,/data-tpv-action="prepare-workstation"/);assert.doesNotMatch(html,/data-tpv-action="apply-workstation"/);
console.log('New physical and web stores are discoverable without granting operational access; existing rights and sessions preserved');
