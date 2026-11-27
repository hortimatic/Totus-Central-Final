import {lineOptions,lineOptionsFromForm} from './line-options.js?v=85fc1d456f797b7440970d7b4ec0ff8ae8ac4c1a';
import {parkingOptions,parkingOptionsFromForm} from './parking-options.js?v=85fc1d456f797b7440970d7b4ec0ff8ae8ac4c1a';
import {stockPolicy,stockPolicyFromForm} from './stock-policy.js?v=85fc1d456f797b7440970d7b4ec0ff8ae8ac4c1a';
import {cashOptions,cashOptionsFromForm} from './cash-counting.js?v=85fc1d456f797b7440970d7b4ec0ff8ae8ac4c1a';
const readers={lineOptions:lineOptionsFromForm,parking:parkingOptionsFromForm,stockPolicy:stockPolicyFromForm,cash:cashOptionsFromForm};
const normalizers={lineOptions,parking:parkingOptions,stockPolicy,cash:cashOptions};
export function referencePolicyPayload(fields,{canSell=false,canEdit=false}={}){
 const groups=fields.getAll('policyGroups');
 if(!groups.length||new Set(groups).size!==groups.length||groups.some(group=>!Object.hasOwn(readers,group)))throw Error('Revisa los ajustes de esta sección.');
 if(groups.includes('lineOptions')&&!canEdit||groups.some(group=>['parking','stockPolicy'].includes(group))&&!canSell)throw Error('No tienes permiso para cambiar estos ajustes.');
 return Object.fromEntries(groups.map(group=>[group,readers[group](fields)]));
}
export function confirmReferencePolicy(saved,payload){
 for(const [group,value] of Object.entries(payload))if(JSON.stringify(normalizers[group](saved?.[group]))!==JSON.stringify(value))throw Error('No se han confirmado los ajustes guardados. Conserva el formulario y vuelve a consultarlos.');
 return Object.fromEntries(Object.keys(payload).map(group=>[group,normalizers[group](saved[group])]));
}
