import {textValue} from './productos-core.js?v=c9a82a729015c0126c6ca38c7b7b4b47c0b15b7b';
import {compareTableValues} from './table-sort.js?v=c9a82a729015c0126c6ca38c7b7b4b47c0b15b7b';
export const categoryId=value=>/^[1-9]\d{0,14}$/.test(String(value));
export function categoryDescendants(rows,id){
 const children=new Map();for(const row of rows){const parent=String(row.id_parent||'0');if(!children.has(parent))children.set(parent,[]);children.get(parent).push(String(row.id));}
 const seen=new Set([String(id)]),queue=[String(id)];for(let i=0;i<queue.length;i++)for(const next of children.get(queue[i])||[])if(!seen.has(next)){seen.add(next);queue.push(next);}return seen;
}
export function categoryHierarchy(rows,{query='',direction='asc',sortField='name'}={}){
 if(!['name','id','active','date_upd'].includes(sortField))throw Error('Orden de categorías no válido.');
 const ids=new Set(),items=rows.map(row=>{const id=String(row.id);if(!categoryId(id)||ids.has(id))throw Error('La lista de categorías contiene identificadores inválidos o repetidos.');ids.add(id);return {...row,id,id_parent:String(row.id_parent||'0'),label:row.__label||textValue(row.name)||'Sin nombre'};});
 const children=new Map(),roots=[];for(const row of items){if(row.id_parent==='0'||!ids.has(row.id_parent)){roots.push(row);continue;}if(!children.has(row.id_parent))children.set(row.id_parent,[]);children.get(row.id_parent).push(row);}
 const result=[],seen=new Set(),walk=(siblings,depth,path)=>{if(depth>100)throw Error('La jerarquía supera cien niveles.');for(const row of [...siblings].sort((a,b)=>compareTableValues(sortField==='name'?a.label:a[sortField],sortField==='name'?b.label:b[sortField],direction)||Number(a.id)-Number(b.id))){if(seen.has(row.id))continue;seen.add(row.id);const next=[...path,row.label];result.push({...row,depth,path:next.join(' / '),orphan:row.id_parent!=='0'&&!ids.has(row.id_parent)});walk(children.get(row.id)||[],depth+1,next);}};
 walk(roots,0,[]);for(const row of items)if(!seen.has(row.id))throw Error('Hay un ciclo en la jerarquía de categorías. Corrígelo antes de mover categorías.');
 const term=query.trim().toLocaleLowerCase('es');if(!term)return result;
 const matching=new Set(result.filter(row=>[row.id,row.label,row.path].join(' ').toLocaleLowerCase('es').includes(term)).map(row=>row.id));
 const byId=new Map(items.map(row=>[row.id,row]));for(const id of [...matching]){let row=byId.get(id);while(row&&row.id_parent!=='0'&&!matching.has(row.id_parent)){matching.add(row.id_parent);row=byId.get(row.id_parent);}}
 return result.filter(row=>matching.has(row.id));
}
export function categoryFields(input,rows,{id=null,physical=false}={}){
 const name=String(input.name||'').trim(),parent=String(input.id_parent||'');
 if(!name||Array.from(name).length>128||/[\x00-\x1f\x7f<>;=#{}]/.test(name))throw Error('Escribe un nombre de categoría válido, de hasta 128 caracteres.');
 const current=id?rows.find(row=>String(row.id)===String(id)):null;
 const root=!physical&&current&&(String(current.id_parent||'0')==='0'||String(current.is_root_category)==='1');
 if(root&&parent!==String(current.id_parent||'0'))throw Error('La categoría raíz no puede trasladarse.');
 if(!root&&!(physical&&parent==='0')&&(!categoryId(parent)||!rows.some(row=>String(row.id)===parent)))throw Error('Selecciona una categoría padre de esta tienda.');
 if(id&&categoryDescendants(rows,id).has(parent))throw Error('Una categoría no puede quedar dentro de sí misma ni de una de sus subcategorías.');
 if(!['0','1'].includes(String(input.active))||root&&String(input.active)!=='1')throw Error('La categoría raíz debe permanecer activa.');
 const slug=String(input.link_rewrite||name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')).trim();
 if(!slug||slug.length>128||!/^[\p{L}\p{N}_-]+$/u.test(slug))throw Error('Revisa la dirección amigable de la categoría.');
 return {name,id_parent:parent,active:String(input.active),link_rewrite:slug,description:String(input.description||''),meta_title:String(input.meta_title||''),meta_description:String(input.meta_description||'')};
}
