/** Existing Central identities and RLS only; no local shop/user master. */
export function createTpvConfigurationReader({actor,rpc,readDrawers,readOperators,readAssignments,readTarget}){
 let generation=0;
 return async({connectionId=null}={})=>{const request=++generation,owner=actor()?.id;if(!owner)throw Error('Vuelve a entrar en tu cuenta.');
  const [manager,context,drawers,operators]=await Promise.all([rpc('totus_api_manager',{}),rpc('totus_sales_context',{}),readDrawers(),readOperators()]);
  if(actor()?.id!==owner||request!==generation)throw Error('La sesión o la selección ha cambiado.');
  const choices=(context.websites||[]).filter(row=>row.status==='active').flatMap(website=>{
   const connection=manager.connections?.find(row=>row.id===website.connection_id);if(!connection?.id||!Number.isSafeInteger(connection.revision)||connection.revision<1)return [];
   if(connection.enabled===false||connection.configured===false||connection.real_data_authorized===false||connection.protocol&&connection.protocol!=='prestashop'||connection.verified_revision!==undefined&&connection.verified_revision!==connection.revision)return [];
   let url;try{url=new URL(website.origin);}catch{return [];}
   if(url.protocol!=='https:'||url.origin!==website.origin||url.username||url.password)return [];
   if(connection.endpoint){try{const endpoint=new URL(connection.endpoint);if(endpoint.origin!==url.origin||endpoint.pathname.replace(/\/$/,'')!=='/api'||endpoint.username||endpoint.password||endpoint.search||endpoint.hash)return [];}catch{return [];}}
   return [{connectionId:connection.id,revision:connection.revision,origin:website.origin,name:typeof website.name==='string'&&website.name.trim()?website.name:website.origin}];
  }).sort((a,b)=>a.name.localeCompare(b.name,'es',{numeric:true}));
  if(new Set(choices.map(row=>row.connectionId)).size!==choices.length)throw Error('Hay varias webs asociadas a la misma conexión. Revisa Conexiones.');
  if(!choices.length)return {mode:'connect-website',connections:[],connectionId:null,revision:null,origin:null,stores:[],drawers:[],operators:[],actorId:owner,accesses:null};
  if(connectionId!==null&&(typeof connectionId!=='string'||!choices.some(row=>row.connectionId===connectionId)))throw Error('La conexión seleccionada ya no está disponible. Actualiza la lista.');
  const selected=connectionId?choices.find(row=>row.connectionId===connectionId):choices.length===1?choices[0]:null;
  if(!selected)return {mode:'choose-connection',connections:choices,connectionId:null,revision:null,origin:null,stores:[],drawers:[],operators:[],actorId:owner,accesses:null};
  const connection={id:selected.connectionId,revision:selected.revision},website={origin:selected.origin};
  if(readTarget){const target=await readTarget({connectionId:connection.id});
   if(actor()?.id!==owner||request!==generation)throw Error('La sesión o la selección ha cambiado.');
   if(target===null)return {mode:'register-target',connections:choices,connectionId:connection.id,revision:connection.revision,origin:website.origin,stores:[],drawers:[],operators:[],actorId:owner,accesses:null};
   if(target?.connectionId!==connection.id||target.origin!==website.origin)throw Error('No se ha podido comprobar la web del puesto. Actualiza la configuración.');
  }
  let accesses=null;
  if(readAssignments){const data=await readAssignments({connectionId:connection.id,revision:connection.revision});
   if(actor()?.id!==owner||request!==generation)throw Error('La sesión o la selección ha cambiado.');
   if(data?.connectionId!==connection.id||data.revision!==connection.revision||!Array.isArray(data.items)||data.items.length>2000)
    throw Error('No se han podido comprobar todos los accesos de caja. Actualiza la configuración.');
   accesses=data.items.map(row=>{
    if(!row||!['operatorId','drawerId','storeId','operatorName','drawerName','storeName'].every(key=>typeof row[key]==='string')||
     !Number.isSafeInteger(row.shopId)||row.shopId<=0||!Number.isSafeInteger(row.revision)||row.revision<=0||
     !['active','operatorActive','drawerActive'].every(key=>typeof row[key]==='boolean')||
     !['sell','open','reconcile'].every(key=>typeof row.permissions?.[key]==='boolean'))throw Error('Un acceso no se ha podido comprobar. Actualiza la configuración.');
    return Object.fromEntries(['operatorId','drawerId','storeId','operatorName','drawerName','storeName','shopId','revision','active','operatorActive','drawerActive','permissions'].map(key=>[key,
     key==='permissions'?Object.fromEntries(['sell','open','reconcile'].map(name=>[name,row.permissions[name]])):row[key]]));
   });
  }
  const sorted=rows=>[...rows].sort((a,b)=>(a.name||a.full_name||a.id).localeCompare(b.name||b.full_name||b.id,'es',{numeric:true}));
  return {mode:'selected',connections:choices,connectionId:connection.id,revision:connection.revision,origin:website.origin,stores:sorted(context.businesses),
   drawers:sorted(drawers.filter(row=>row.active)),operators:sorted(operators.filter(row=>row.active)),actorId:owner,accesses};
 };
}
