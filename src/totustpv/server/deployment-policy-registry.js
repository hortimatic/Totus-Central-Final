import {TOTUS_QA_POLICY} from './deployment-qa-policy.js?v=85fc1d456f797b7440970d7b4ec0ff8ae8ac4c1a';
import {assertQaTarget} from './qa-policy.js?v=85fc1d456f797b7440970d7b4ec0ff8ae8ac4c1a';
const need=(value,code)=>{if(!value)throw Error(code);};
/** Server-owned targets only. This is not an input schema for browser requests.
 * Registering a target does not assign users, configure a native profile or
 * authorize writes: those independent checks are still required downstream. */
export function createDeploymentPolicyRegistry(values=[TOTUS_QA_POLICY]){
 need(Array.isArray(values)&&values.length>0&&values.length<=100,'TPV_QA_REGISTRY_INVALID');
 const policies=structuredClone(values).map(value=>{
  need(value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).every(key=>['stage','nativeVersion','connectionId','origin','protectedOrigins','protectedConnectionIds'].includes(key))&&Array.isArray(value.protectedOrigins)&&Array.isArray(value.protectedConnectionIds),'TPV_QA_REGISTRY_INVALID');
  const policy={...value,protectedOrigins:[...new Set([...TOTUS_QA_POLICY.protectedOrigins,...value.protectedOrigins])],protectedConnectionIds:[...new Set([...TOTUS_QA_POLICY.protectedConnectionIds,...value.protectedConnectionIds])]};
  assertQaTarget({id:policy.connectionId,endpoint:policy.origin+'/api',website_origin:policy.origin},{connectionId:policy.connectionId,environment:'qa'},policy);
  return policy;
 });
 need(new Set(policies.map(value=>value.connectionId)).size===policies.length&&new Set(policies.map(value=>value.origin)).size===policies.length,'TPV_QA_REGISTRY_AMBIGUOUS');
 return Object.freeze({resolve(connectionId=null){
  const policy=connectionId===null||connectionId===undefined?policies[0]:policies.find(value=>value.connectionId===connectionId);
  need(policy,'TPV_QA_TARGET_NOT_REGISTERED');return structuredClone(policy);
 }});
}
