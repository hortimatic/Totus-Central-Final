// Reuses the existing authenticated Products stock stages and their server journal.
// A sent stage is only recovered with its original identity, never prepared again.
export function createInventoryAdjustment({storage,actor,can,connect}){
 let running=false;
 return async function apply(scope,counts){
  if(running)throw Error('El inventario ya se está comprobando.');
  const owner=actor(),key='totus:tpv:inventory-adjustment:v1:'+encodeURIComponent(owner)+':'+scope.connectionId+':'+scope.shopId;
  const guard=()=>{if(!owner||owner!==actor()||!can())throw Error('La sesión o los permisos de inventario han cambiado.');};
  guard();if(!scope.connectionId||!Number.isSafeInteger(scope.shopId)||scope.shopId<1)throw Error('Selecciona una tienda conectada.');
  if(!Array.isArray(counts)||!counts.length||counts.length>10000||new Set(counts.map(r=>r.id)).size!==counts.length||counts.some(r=>!/^\d+:\d+$/.test(r.id)||!Number.isSafeInteger(r.expected)||!Number.isSafeInteger(r.count)||r.count<0||r.count>100000000))throw Error('Revisa los artículos y cantidades del recuento.');
  if(!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(scope.inventoryId||''))throw Error('El recuento necesita una identidad guardada.');
  const intent=JSON.stringify([scope.inventoryId,counts.map(({id,expected,count})=>({id,expected,count}))]),raw=storage.getItem(key);
  let journal=raw?JSON.parse(raw):null;
  if(journal&&journal.intent!==intent&&journal.rows.some(r=>r.sent&&!r.done))throw Error('Recupera el ajuste pendiente antes de modificar el recuento.');
  if(!journal||journal.intent!==intent)journal={intent,parent:crypto.randomUUID(),rows:counts.map(r=>({...r,step:'inventory_'+crypto.randomUUID().replaceAll('-','')}))};
  const persist=()=>{guard();storage.setItem(key,JSON.stringify(journal));};
  let transport;
  const call=async(action,args)=>{guard();const result=await transport(action,args);guard();if(result?.ok!==true)throw Error('La tienda no confirmó la operación de inventario.');return result;};
  const readStock=async product=>{
   const rows=[];
   for(let page=0;page<1000;page++){
    const data=await call('prestashop_read',{resource:'stock_availables',product_ids:[product],page,page_size:100});
    if(!Array.isArray(data.rows)||data.rows.some(r=>String(r.id_product)!==product)||data.possibly_more&&!data.rows.length)throw Error('No se han consultado todas las existencias del producto.');
    rows.push(...data.rows);if(!data.possibly_more)return rows;
   }
   throw Error('El listado de existencias supera el límite de comprobación.');
  };
  running=true;
  try{
   transport=await connect(scope);guard();persist();
   for(const row of journal.rows){
    if(row.done)continue;
    const [product,attribute]=row.id.split(':');
    if(!row.sent){
     const listing=await readStock(product);
     const matches=listing.filter(s=>String(s.id_product)===product&&String(s.id_product_attribute)===attribute);
     if(matches.length!==1||Number(matches[0].id_shop)!==scope.shopId)throw Error('No hay un registro único de existencias para esta tienda y variante.');
     const stock=matches[0];
     if(Number(stock.quantity)!==row.expected)throw Error('Las existencias de '+row.name+' han cambiado desde el recuento. Revisa ese artículo antes de ajustar.');
     if(row.count===row.expected){row.done=true;row.completedAt=new Date().toISOString();persist();continue;}
     if(String(stock.depends_on_stock)!=='0')throw Error('Este artículo utiliza gestión avanzada de existencias.');
     row.args={existing_product:true,parent_request_id:journal.parent,product_id:product,kind:'stock',step_key:row.step,record_id:String(stock.id),fields:{id_product_attribute:attribute,quantity:String(row.count),out_of_stock:String(stock.out_of_stock),depends_on_stock:'0',location:String(stock.location||'')}};
     const before=await call('prestashop_product_step_prepare',row.args);
     const observed=await readStock(product);
     if(Number(observed.find(s=>String(s.id)===String(stock.id))?.quantity)!==row.expected)throw Error('El stock cambió durante la comprobación. No se ha aplicado este ajuste.');
     const prepared=await call('prestashop_product_step_prepare',row.args);
     if(before.fingerprint!==prepared.fingerprint||! /^[a-f0-9]{64}$/.test(prepared.fingerprint||'')||prepared.can_commit!==true||prepared.persisted!==false)throw Error('No se puede confirmar este ajuste. Revisa la conexión o los cambios recientes.');
     row.fingerprint=prepared.fingerprint;row.sent=true;persist();
    }
    const result=await call('prestashop_product_step_commit',{...row.args,expected_fingerprint:row.fingerprint,confirmed:true});
    if(result.persisted!==true||result.verified!==true||String(result.record_id)!==row.args.record_id)throw Error('Ajuste enviado sin confirmación. Recupera el mismo inventario; no lo repitas.');
    row.done=true;row.completedAt=new Date().toISOString();persist();
   }
   return {verified:true,items:journal.rows.length,adjusted:journal.rows.filter(r=>r.count!==r.expected).length};
  }finally{running=false;}
 };
}
