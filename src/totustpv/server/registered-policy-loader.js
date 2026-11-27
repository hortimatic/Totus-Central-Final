import {createDeploymentPolicyRegistry} from './deployment-policy-registry.js?v=a6b725d2c27e1b8dd5ebb4f53404f641b6e27dd9';
/** Uses the authenticated user's RPC projection, before privileged clients or
 * native credentials. A registered target alone never grants a workstation. */
export async function loadRegisteredTpvPolicy({scoped,connectionId}){
 const {data,error}=await scoped.rpc('totus_tpv_target_policy',{p_connection:connectionId});
 if(error)throw Error(/^TPV_[A-Z0-9_]{1,90}$/.test(error.message||'')?error.message:'TPV_TARGET_POLICY_UNAVAILABLE');
 if(data?.connectionId!==connectionId)throw Error('TPV_TARGET_POLICY_UNAVAILABLE');
 return createDeploymentPolicyRegistry([data]).resolve(connectionId);
}
