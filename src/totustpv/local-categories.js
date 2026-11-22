export function localCategories(rows){
 if(!Array.isArray(rows)||rows.some(r=>!Number.isSafeInteger(r.id)||r.id<1||!Number.isSafeInteger(r.parentId)||r.parentId<0||typeof r.name!=='string'))throw Error('Las categorías de esta tienda no son válidas.');
 const byId=new Map(rows.map(r=>[r.id,r]));if(byId.size!==rows.length)throw Error('La tienda devolvió categorías repetidas.');
 return rows.filter(r=>r.active&&(!r.root||r.parentId>0)).map(r=>{let parent=byId.get(r.parentId),path=[r.name],seen=new Set([r.id]);while(parent){if(seen.has(parent.id)||seen.size>=100)throw Error('La jerarquía de categorías es circular.');seen.add(parent.id);if(!parent.root)path.unshift(parent.name);parent=byId.get(parent.parentId);}return {...r,label:path.join(' / ')};}).sort((a,b)=>a.label.localeCompare(b.label,'es',{numeric:true}));
}
export function categoryFilterIds(rows,id){
 if(!id)return new Set();const result=new Set([id]);let added=true;while(added){added=false;for(const row of rows)if(result.has(row.parentId)&&!result.has(row.id)){result.add(row.id);added=true;}}return result;
}
