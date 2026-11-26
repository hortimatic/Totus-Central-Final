// Browser origins owned by this application. This is not an authentication layer.
export const APPLICATION_ORIGINS=Object.freeze([
 'https://hortimatic.github.io',
 'https://totuscentral.totuscode.com',
 ...(globalThis.Deno?.env?.get?.('SUPABASE_URL')==='https://ltwfmhilbvpzqdgjhvjb.supabase.co'?['https://totuscentralfinal.totuscode.com']:[])
]);

// Local review is allowed only by the independent final backend. A browser
// header cannot enable it on production, and authentication remains mandatory.
export function applicationOrigins(backendUrl=''){
 return backendUrl==='https://ltwfmhilbvpzqdgjhvjb.supabase.co'
  ?[...APPLICATION_ORIGINS,'http://127.0.0.1:4184','https://totuscentralfinal.totuscode.com']:APPLICATION_ORIGINS;
}

/** Preserve the service response and its auth checks, varying only browser CORS. */
export function withApplicationCors(handler,{backendUrl=()=>globalThis.Deno?.env?.get?.('SUPABASE_URL')??''}={}){
 return async function applicationRequest(request,...args){
  const origin=request.headers.get('origin');
  const response=await handler(request,...args);
  const headers=new Headers(response.headers);
  if(origin){
   if(applicationOrigins(backendUrl()).includes(origin))headers.set('Access-Control-Allow-Origin',origin);
   else headers.delete('Access-Control-Allow-Origin');
  }
  const vary=headers.get('Vary');
  if(!vary?.split(',').some(value=>value.trim().toLowerCase()==='origin')){
   headers.set('Vary',vary?`${vary}, Origin`:'Origin');
  }
  return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
 };
}
