import {createDeploymentPolicyRegistry} from './deployment-policy-registry.js?v=6959d5cdc2c7cc8f8737f2ca2a6e9cf36df3b402';
/** Uses the authenticated user's RPC projection, before privileged clients or
 * native credentials. A registered target alone never grants a workstation. */
export async function loadRegisteredTpvPolicy({scoped,connectionId}){
 const {data,error}=await scoped.rpc('totus_tpv_target_policy',{p_connection:connectionId});
 if(error)throw Error(/^TPV_[A-Z0-9_]{1,90}$/.test(error.message||'')?error.message:'TPV_TARGET_POLICY_UNAVAILABLE');
 if(data?.connectionId!==connectionId)throw Error('TPV_TARGET_POLICY_UNAVAILABLE');
 return createDeploymentPolicyRegistry([data]).resolve(connectionId);
}
