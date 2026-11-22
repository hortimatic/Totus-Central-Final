// Adapt the existing directory presentation to Central records. This does not
// copy data, create another directory, or require an active website connection.
export const CENTRAL_DIRECTORY_KINDS={clientes:'customers',proveedores:'suppliers',marcas:'brands'};
export function centralDirectoryRow(kind,row){
 const raw=structuredClone(row.details?.sourceData||{}),originalName=[raw.firstname,raw.lastname].filter(Boolean).join(' ').trim();
 const first=originalName===row.name?raw.firstname:row.name,last=originalName===row.name?raw.lastname:'';
 return {...raw,id:row.id,name:row.name,...(kind==='clientes'?{firstname:first||row.name,lastname:last||''}:{}),
  email:row.email??raw.email??'',phone:row.phone??'',address1:row.address??'',city:row.city??'',postcode:row.postal_code??'',
  province:row.province??'',country:row.country??'',dni:row.tax_id??'',company:row.details?.company??raw.company??'',
  active:row.active===undefined?String(raw.active??'1'):row.active?'1':'0',date_add:row.created_at,date_upd:row.updated_at,
  __native:row,__sourceWebsite:row.source_website||null,__addresses:row.details?.addresses||[]};
}
