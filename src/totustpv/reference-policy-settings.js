import {lineOptions,lineOptionsFromForm} from './line-options.js?v=603281a068b6e6a22323154e4de1692de7470f18';
import {parkingOptions,parkingOptionsFromForm} from './parking-options.js?v=603281a068b6e6a22323154e4de1692de7470f18';
import {stockPolicy,stockPolicyFromForm} from './stock-policy.js?v=603281a068b6e6a22323154e4de1692de7470f18';
import {cashOptions,cashOptionsFromForm} from './cash-counting.js?v=603281a068b6e6a22323154e4de1692de7470f18';
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
