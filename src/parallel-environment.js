// A build-time accident guard, not a replacement for database authorization.
export function assertParallelBackend({url,projectRef,forbiddenProjectRefs=[]}){
 let target;try{target=new URL(url);}catch{throw Error('Falta configurar la base independiente del entorno paralelo.');}
 if(typeof projectRef!=='string'||!/^[a-z0-9]{20}$/.test(projectRef)||!Array.isArray(forbiddenProjectRefs)||forbiddenProjectRefs.includes(projectRef)||target.protocol!=='https:'||target.hostname!==projectRef+'.supabase.co'||target.port||target.username||target.password||target.pathname!=='/'||target.search||target.hash)throw Error('El entorno paralelo no puede utilizar la base de producción. Revisa su configuración independiente.');
 return Object.freeze({projectRef,url:target.origin});
}
