// Runs only after the handler authenticates the user. A scoped ticket pins the
// authorized store/website/connection; only verified official reads are saved.
export async function synchronizeCategories({store,scoped,admin,dispatch}){
 const check=r=>{if(r.error)throw Error(r.error.message);return r.data;};
 const context=check(await scoped.rpc('totus_category_workspace',{p_store:store,p_sync:true}));
 if(context?.storeId!==store||!context.token||!context.connected||!context.website||!context.connectionId)throw Error('Selecciona una tienda con una web verificada.');
 async function read(resource){
  const rows=[],seen=new Set();
  for(let page=0;page<=100;page++){
   const r=await dispatch({action:'prestashop_directory_read',kind:'categorias',store:context.website,id:context.connectionId,revision:context.connectionRevision,call_id:crypto.randomUUID(),resource,page,page_size:100});
   const v=r.body;if(!r.ok||v?.ok!==true||v.store!==context.website||v.resource!==resource||v.page!==page||!Array.isArray(v.rows)||typeof v.possibly_more!=='boolean'||v.rows.length>100)throw Error(v?.error||'La web no confirmó una lectura completa de categorías.');
   for(const row of v.rows){if(!/^[1-9]\d{0,14}$/.test(String(row.id))||seen.has(String(row.id)))throw Error('La web devolvió categorías repetidas o sin ID.');seen.add(String(row.id));rows.push(row);}
   if(!v.possibly_more)return rows;
   if(!v.rows.length||rows.length>=10000)throw Error('La lectura de categorías no ha terminado.');
  }throw Error('No se pudo completar la lectura.');
 }
 const languages=await read('languages');if(!languages.some(l=>String(l.active)==='1'))throw Error('No se ha comprobado un idioma activo en la web.');
 const rows=await read('categories'),second=await read('categories');
 if(JSON.stringify(rows)!==JSON.stringify(second))throw Error('Las categorías han cambiado durante la consulta. Sincroniza de nuevo.');
 const byId=new Map(rows.map(r=>[String(r.id),r]));
 for(const row of rows){let parent=String(row.id_parent),seen=new Set([String(row.id)]);for(let depth=0;parent!=='0';depth++){if(depth>=100||seen.has(parent)||!byId.has(parent))throw Error('La web contiene una jerarquía de categorías incompleta o circular.');seen.add(parent);parent=String(byId.get(parent).id_parent);}}
 const result=check(await admin.rpc('totus_category_snapshot_finish',{p_token:context.token,p_items:rows,p_languages:languages}));
 if(result?.storeId!==store||result.verified!==true)throw Error('No se pudo verificar el catálogo guardado de la tienda.');return result;
}
