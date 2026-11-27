import {createDeploymentPolicyRegistry} from './deployment-policy-registry.js?v=3c908e1b6b9a494f072f6cc731680e721f13dfa0';
/** Uses the authenticated user's RPC projection, before privileged clients or
 * native credentials. A registered target alone never grants a workstation. */
export async function loadRegisteredTpvPolicy({scoped,connectionId}){
 const {data,error}=await scoped.rpc('totus_tpv_target_policy',{p_connection:connectionId});
 if(error)throw Error(/^TPV_[A-Z0-9_]{1,90}$/.test(error.message||'')?error.message:'TPV_TARGET_POLICY_UNAVAILABLE');
 if(data?.connectionId!==connectionId)throw Error('TPV_TARGET_POLICY_UNAVAILABLE');
 return createDeploymentPolicyRegistry([data]).resolve(connectionId);
}
