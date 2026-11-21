-- Repairs user edits of imported catalogue records; no business records are seeded.
begin;
CREATE OR REPLACE FUNCTION public.totus_tpv_local_catalogue_save(p_request uuid, p_store uuid, p_item uuid, p_product uuid, p_variant uuid, p_data jsonb, p_revision bigint DEFAULT 0)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare actor uuid:=auth.uid();old private.totus_tpv_local_catalogue;row private.totus_tpv_local_catalogue;prior private.totus_tpv_local_catalogue_requests;intent jsonb;unit text;stock numeric;
begin
 if actor is null or not exists(select 1 from public.profiles where id=actor and active) or private.totus_can('productos','edit') is not true or private.totus_local_store_access(p_store) is not true then raise exception 'TPV_LOCAL_CATALOGUE_FORBIDDEN';end if;
 if p_request is null or p_item is null or not exists(select 1 from public.ops_stores where id=p_store and active) or not exists(select 1 from public.products where id=p_product and store_id=p_store) or (p_variant is not null and not exists(select 1 from public.product_variants where id=p_variant and product_id=p_product)) then raise exception 'TPV_LOCAL_CATALOGUE_INVALID';end if;
 if jsonb_typeof(p_data) is distinct from 'object' or length(p_data::text)>2000000 or p_data-array['name','reference','ean','priceCents','taxBasisPoints','stock','metadata','active','quantityUnit']<>'{}'::jsonb or not(p_data?&array['name','reference','ean','priceCents','taxBasisPoints','stock','metadata','active']) or jsonb_typeof(p_data->'name') is distinct from 'string' or char_length(btrim(p_data->>'name')) not between 1 and 512 or jsonb_typeof(p_data->'reference') is distinct from 'string' or char_length(p_data->>'reference')>128 or jsonb_typeof(p_data->'ean') is distinct from 'string' or char_length(p_data->>'ean')>32 or jsonb_typeof(p_data->'metadata') is distinct from 'object' or jsonb_typeof(p_data->'active') is distinct from 'boolean' then raise exception 'TPV_LOCAL_CATALOGUE_INVALID';end if;
 if jsonb_typeof(p_data->'priceCents') is distinct from 'number' or p_data->>'priceCents'!~'^(0|[1-9][0-9]{0,8})$' or jsonb_typeof(p_data->'taxBasisPoints') is distinct from 'number' or p_data->>'taxBasisPoints'!~'^(0|[1-9][0-9]{0,4})$' or (p_data->>'taxBasisPoints')::int>10000 or jsonb_typeof(p_data->'stock') is distinct from 'number' then raise exception 'TPV_LOCAL_CATALOGUE_INVALID';end if;
 if p_data?'quantityUnit' and (jsonb_typeof(p_data->'quantityUnit') is distinct from 'string' or p_data->>'quantityUnit' not in('unit','kg','l','m')) then raise exception 'TPV_LOCAL_QUANTITY_INVALID';end if;
 intent:=jsonb_build_object('storeId',p_store,'itemId',p_item,'productId',p_product,'variantId',p_variant,'data',p_data,'revision',p_revision);
 perform pg_advisory_xact_lock(hashtextextended('local-catalogue-request:'||p_request::text,0));
 select * into prior from private.totus_tpv_local_catalogue_requests where id=p_request;
 if found then if prior.actor_id<>actor or prior.intent<>intent then raise exception 'TPV_LOCAL_REPLAY_MISMATCH';end if;return prior.result;end if;
 perform pg_advisory_xact_lock(hashtextextended('local-catalogue:'||p_store::text||':'||p_item::text,0));
 select * into old from private.totus_tpv_local_catalogue where store_id=p_store and id=p_item for update;
 if p_revision is null or p_revision<>coalesce(old.revision,0) then raise exception 'TPV_LOCAL_CATALOGUE_STALE';end if;
 if old.id is not null and (old.product_id<>p_product or old.variant_id is distinct from p_variant) then raise exception 'TPV_LOCAL_CATALOGUE_IDENTITY_CHANGED';end if;
 unit:=coalesce(p_data->>'quantityUnit',old.quantity_unit,'unit');stock:=(p_data->>'stock')::numeric;if stock not between -999999999.999 and 999999999.999 or stock<>round(stock,case when unit='unit' then 0 else 3 end) then raise exception 'TPV_LOCAL_QUANTITY_INVALID';end if;
 if old.id is not null and old.quantity_unit<>unit and old.stock<>0 then raise exception 'TPV_LOCAL_QUANTITY_UNIT_IN_USE';end if;
 insert into private.totus_tpv_local_catalogue(store_id,id,product_id,variant_id,name,reference,ean,price_cents,tax_basis_points,stock,quantity_unit,metadata,revision,active)
 values(p_store,p_item,p_product,p_variant,btrim(p_data->>'name'),p_data->>'reference',p_data->>'ean',(p_data->>'priceCents')::bigint,(p_data->>'taxBasisPoints')::integer,stock,unit,p_data->'metadata',coalesce(old.revision,0)+1,(p_data->>'active')::boolean)
 on conflict(store_id,id) do update set name=excluded.name,reference=excluded.reference,ean=excluded.ean,price_cents=excluded.price_cents,tax_basis_points=excluded.tax_basis_points,stock=excluded.stock,quantity_unit=excluded.quantity_unit,metadata=private.totus_tpv_local_catalogue.metadata||excluded.metadata,revision=excluded.revision,active=excluded.active returning * into row;
 insert into private.totus_tpv_local_audit(actor_id,action,record_id,previous,current) values(actor,'catalogue',p_item,to_jsonb(old),to_jsonb(row));
 insert into private.totus_tpv_local_catalogue_requests values(p_request,actor,p_store,p_item,intent,to_jsonb(row),clock_timestamp());
 return to_jsonb(row);
end $function$
;
CREATE OR REPLACE FUNCTION public.totus_local_store_workspace(p_store uuid DEFAULT NULL::uuid, p_kind text DEFAULT 'context'::text, p_action text DEFAULT 'list'::text, p_id uuid DEFAULT NULL::uuid, p_request uuid DEFAULT NULL::uuid, p_data jsonb DEFAULT '{}'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare actor uuid:=auth.uid();module_name text;table_name text;items jsonb;result jsonb;intent jsonb;prior private.totus_local_workspace_requests;row_id uuid;variant jsonb;v_variant uuid;item_id uuid;attributes jsonb;unit text;price bigint;tax integer;qty numeric;variant_count integer;product_row public.products;catalogue_row private.totus_tpv_local_catalogue;store_row record;
begin
 if actor is null or not exists(select 1 from public.profiles where id=actor and active) then raise exception 'Necesitas una sesión activa.';end if;
 if p_kind='context' and p_action='list' then
  select coalesce(jsonb_agg(jsonb_build_object('id',s.id,'name',s.name,'code',s.code) order by s.sort_order,s.name),'[]') into items from public.ops_stores s where private.totus_local_store_access(s.id);
  return jsonb_build_object('stores',items);
 end if;
 module_name:=case p_kind when 'sales' then 'ventas' when 'products' then 'productos' when 'customers' then 'facturacion' when 'suppliers' then 'gastos' when 'brands' then 'pricing' when 'summary' then 'inicio' else null end;
 if module_name is null or p_action not in('list','save','delete') or private.totus_can(module_name,case p_action when 'list' then 'view' when 'delete' then 'delete' else case when p_id is null then 'create' else 'edit' end end) is not true or private.totus_local_store_access(p_store) is not true then raise exception 'No tienes acceso a esta tienda o a esta operación.';end if;
 perform 1 from public.ops_stores where id=p_store for key share;
 if p_kind='sales' and p_action='list' then
  return jsonb_build_object('storeId',p_store,'items',coalesce((select jsonb_agg(to_jsonb(s)||jsonb_build_object('name','Venta '||left(s.id::text,8),'payments',coalesce((select jsonb_agg(to_jsonb(p)) from private.totus_tpv_local_payments p where p.sale_id=s.id),'[]'),'refunds',coalesce((select jsonb_agg(to_jsonb(f)) from private.totus_tpv_local_refunds f where f.sale_id=s.id),'[]')) order by s.created_at desc) from private.totus_tpv_local_sales s where s.store_id=p_store),'[]'));
 end if;
 if p_kind='summary' and p_action='list' then
  return jsonb_build_object('storeId',p_store,'products',(select count(*) from public.products where store_id=p_store),'customers',(select count(*) from public.ops_customers where store_id=p_store),'suppliers',(select count(*) from public.ops_suppliers where store_id=p_store),'stock',(select coalesce(sum(stock),0) from private.totus_tpv_local_catalogue where store_id=p_store and active),'sales',(select count(*) from private.totus_tpv_local_sales where store_id=p_store),'returnedCents',(select coalesce(sum(total_cents),0) from private.totus_tpv_local_refunds where store_id=p_store and status='confirmed'),'salesCents',(select coalesce(sum(total_cents),0) from private.totus_tpv_local_sales where store_id=p_store),'collectedCents',(select coalesce(sum(p.amount_cents),0) from private.totus_tpv_local_payments p join private.totus_tpv_local_sales s on s.id=p.sale_id where s.store_id=p_store));
 end if;
 if p_kind in('sales','summary') then raise exception 'Esta consulta es de solo lectura.';end if;
 table_name:=case p_kind when 'products' then 'products' when 'customers' then 'ops_customers' when 'suppliers' then 'ops_suppliers' when 'brands' then 'brands' end;
 if p_action='list' then
  if p_kind='products' then
   select coalesce(jsonb_agg(to_jsonb(p)||jsonb_build_object('variants',coalesce((select jsonb_agg(to_jsonb(v) order by v.name) from public.product_variants v where v.product_id=p.id),'[]'),'catalogue',coalesce((select jsonb_agg(to_jsonb(c) order by c.reference) from private.totus_tpv_local_catalogue c where c.store_id=p_store and c.product_id=p.id),'[]')) order by p.name),'[]') into items from public.products p where p.store_id=p_store;
  else execute format('select coalesce(jsonb_agg(to_jsonb(t) order by t.name),''[]'') from public.%I t where t.store_id=$1',table_name) into items using p_store;end if;
  return jsonb_build_object('storeId',p_store,'items',items);
 end if;
 if p_request is null or jsonb_typeof(p_data)<>'object' or octet_length(p_data::text)>200000 then raise exception 'Solicitud inválida.';end if;
 intent:=jsonb_build_object('store',p_store,'kind',p_kind,'action',p_action,'id',p_id,'data',p_data);
 perform pg_advisory_xact_lock(hashtextextended('native-workspace:'||p_request::text,0));
 select * into prior from private.totus_local_workspace_requests where id=p_request;
 if found then if prior.actor_id<>actor or prior.intent<>intent then raise exception 'La solicitud ya contiene otros datos.';end if;return prior.result;end if;
 row_id:=coalesce(p_id,gen_random_uuid());
 if p_id is not null then execute format('select to_jsonb(t) from public.%I t where id=$1 and store_id=$2 for update',table_name) into result using p_id,p_store;if result is null then raise exception 'El registro no pertenece a esta tienda o ya no existe.';end if;end if;
 if p_action='delete' then
  if p_id is null then raise exception 'Selecciona el registro.';end if;
  if p_kind='products' then
   if exists(select 1 from private.totus_tpv_local_sales s cross join lateral jsonb_array_elements(coalesce(s.snapshot->'lines','[]')) l where l->>'productId' in(select id::text from private.totus_tpv_local_catalogue where product_id=p_id)) then raise exception 'El producto tiene ventas. Desactívalo para conservar su historial.';end if;
   delete from private.totus_tpv_local_catalogue where store_id=p_store and product_id=p_id;
  end if;
  execute format('delete from public.%I where id=$1 and store_id=$2',table_name) using p_id,p_store;
  result:=jsonb_build_object('id',p_id,'storeId',p_store,'deleted',true);
 elsif p_kind='products' then
  if btrim(coalesce(p_data->>'name',''))='' or char_length(p_data->>'name')>255 or (btrim(coalesce(p_data->>'reference',''))='' and not exists(select 1 from public.products p where p.id=p_id and p.store_id=p_store and p.source_website is not null)) or char_length(p_data->>'reference')>120 then raise exception 'Indica nombre y referencia válidos.';end if;
  unit:=coalesce(p_data->>'unit','unit');if unit not in('unit','kg','l','m') then raise exception 'Unidad no válida.';end if;
  price:=(p_data->>'priceCents')::bigint;tax:=(p_data->>'taxBasisPoints')::int;qty:=(p_data->>'stock')::numeric;
  if price<0 or price>999999999 or tax<0 or tax>10000 or qty< -999999999.999 or qty>999999999.999 or qty<>round(qty,case when unit='unit' then 0 else 3 end) then raise exception 'Revisa precio, IVA y existencias.';end if;
  if nullif(p_data->>'brandId','') is not null and not exists(select 1 from public.brands where id=(p_data->>'brandId')::uuid and store_id=p_store) then raise exception 'La marca no pertenece a esta tienda.';end if;
  variant_count:=jsonb_array_length(coalesce(p_data->'variants','[]'));if variant_count>100 then raise exception 'Máximo 100 variantes por guardado.';end if;
  if p_id is not null then perform 1 from private.totus_tpv_local_catalogue where store_id=p_store and product_id=p_id order by id for update; if p_data?'catalogueRevisions' and exists(select 1 from private.totus_tpv_local_catalogue c where c.store_id=p_store and c.product_id=p_id and (p_data#>>array['catalogueRevisions',c.id::text])::bigint is distinct from c.revision) then raise exception 'Las existencias han cambiado mientras editabas. Vuelve a abrir la ficha.';end if;end if;
  if p_id is not null and exists(select 1 from public.product_variants v where v.product_id=p_id and not exists(select 1 from jsonb_array_elements(p_data->'variants') x where x->>'id'=v.id::text)) then raise exception 'Conserva todas las combinaciones existentes para proteger su stock e historial.';end if;
  if p_id is not null and p_data->>'expectedRevision' is distinct from (select updated_at::text from public.products where id=p_id) and (p_data->>'expectedRevision')::timestamptz is distinct from (select updated_at from public.products where id=p_id) then raise exception 'La ficha ha cambiado. Vuelve a abrirla antes de guardar.';end if;
  if nullif(p_data->>'supplierId','') is not null and not exists(select 1 from public.ops_suppliers where id=(p_data->>'supplierId')::uuid and store_id=p_store) then raise exception 'El proveedor no pertenece a esta tienda.';end if;
  insert into public.products(id,store_id,source_website,source_id,sku,name,product_type,status,current_pvp,brand_id,supplier_id,details,created_by) values(row_id,p_store,(select source_website from public.products where id=row_id and store_id=p_store),(select source_id from public.products where id=row_id and store_id=p_store),btrim(p_data->>'reference'),btrim(p_data->>'name'),case when variant_count>0 then 'variants' else 'simple' end,'ACEPTADO',price/100.0,nullif(p_data->>'brandId','')::uuid,nullif(p_data->>'supplierId','')::uuid,p_data-array['variants','expectedRevision'],actor)
  on conflict(id) do update set name=excluded.name,sku=excluded.sku,current_pvp=excluded.current_pvp,brand_id=excluded.brand_id,supplier_id=excluded.supplier_id,details=public.products.details||excluded.details,updated_at=now() returning * into product_row;
  if variant_count=0 then
   select * into catalogue_row from private.totus_tpv_local_catalogue c where c.store_id=p_store and c.product_id=row_id and c.variant_id is null for update;
   perform public.totus_tpv_local_catalogue_save(gen_random_uuid(),p_store,coalesce(catalogue_row.id,row_id),row_id,null,jsonb_build_object('name',product_row.name,'reference',product_row.sku,'ean',coalesce(p_data->>'ean',''),'priceCents',price,'taxBasisPoints',tax,'stock',qty,'quantityUnit',unit,'metadata',jsonb_build_object('brandId',product_row.brand_id),'active',coalesce((p_data->>'active')::boolean,true)),coalesce(catalogue_row.revision,0));
  else
   for variant in select value from jsonb_array_elements(p_data->'variants') loop
    attributes:=variant->'attributes';if jsonb_typeof(attributes)<>'object' or attributes='{}' or length(attributes::text)>2000 or (btrim(coalesce(variant->>'reference',''))='' and not exists(select 1 from public.product_variants pv where pv.id=nullif(variant->>'id','')::uuid and pv.product_id=row_id and pv.source_website is not null)) then raise exception 'Cada variante necesita referencia y atributos.';end if;
    v_variant:=coalesce(nullif(variant->>'id','')::uuid,gen_random_uuid());
    if variant?'id' and not exists(select 1 from public.product_variants v where v.id=v_variant and v.product_id=row_id) then raise exception 'La combinación no pertenece al producto.';end if;
    insert into public.product_variants(id,product_id,sku,name,attributes,pvp,active) values(v_variant,row_id,btrim(variant->>'reference'),(select string_agg(key||': '||value,' · ' order by key) from jsonb_each_text(attributes)),attributes,(variant->>'priceCents')::bigint/100.0,coalesce((p_data->>'active')::boolean,true) and coalesce((variant->>'active')::boolean,true)) on conflict(id) do update set sku=excluded.sku,name=excluded.name,attributes=excluded.attributes,pvp=excluded.pvp,active=excluded.active;
    select * into catalogue_row from private.totus_tpv_local_catalogue c where c.store_id=p_store and c.id=v_variant for update;
    perform public.totus_tpv_local_catalogue_save(gen_random_uuid(),p_store,v_variant,row_id,v_variant,jsonb_build_object('name',product_row.name||' · '||(select name from public.product_variants where id=v_variant),'reference',variant->>'reference','ean',coalesce(variant->>'ean',''),'priceCents',(variant->>'priceCents')::bigint,'taxBasisPoints',tax,'stock',(variant->>'stock')::numeric,'quantityUnit',unit,'metadata',jsonb_build_object('attributes',attributes,'brandId',product_row.brand_id),'active',coalesce((p_data->>'active')::boolean,true) and coalesce((variant->>'active')::boolean,true)),coalesce(catalogue_row.revision,0));
   end loop;
  end if;
  result:=jsonb_build_object('id',row_id,'storeId',p_store,'saved',true);
 else
  if btrim(coalesce(p_data->>'name',''))='' or char_length(p_data->>'name')>255 then raise exception 'Indica un nombre válido.';end if;
  if p_kind='brands' then
   insert into public.brands(id,store_id,name,notes) values(row_id,p_store,btrim(p_data->>'name'),coalesce(p_data->>'notes','')) on conflict(id) do update set name=excluded.name,notes=excluded.notes;
  else
   execute format('insert into public.%I(id,store_id,name,email,phone,address,notes) values($1,$2,$3,$4,$5,$6,$7) on conflict(id) do update set name=excluded.name,email=excluded.email,phone=excluded.phone,address=excluded.address,notes=excluded.notes',table_name) using row_id,p_store,btrim(p_data->>'name'),coalesce(p_data->>'email',''),coalesce(p_data->>'phone',''),coalesce(p_data->>'address',''),coalesce(p_data->>'notes','');
  end if;
  result:=jsonb_build_object('id',row_id,'storeId',p_store,'saved',true);
 end if;
  if p_action='save' and p_kind in('customers','suppliers') then
   if exists(select 1 from jsonb_each(p_data) e where e.key in('taxId','city','postalCode','province','country','company','addressComment','deliveryAddress') and (jsonb_typeof(e.value)<>'string' or char_length(e.value#>>'{}')>1000)) then raise exception 'Revisa los datos fiscales y de dirección.';end if;
   execute format('update public.%I set tax_id=coalesce($2->>''taxId'',tax_id),city=coalesce($2->>''city'',city),postal_code=coalesce($2->>''postalCode'',postal_code),province=coalesce($2->>''province'',province),country=coalesce($2->>''country'',country) where id=$1',table_name) using row_id,p_data;
   if p_kind='customers' then update public.ops_customers set details=details||jsonb_strip_nulls(jsonb_build_object('company',p_data->'company','comment',p_data->'addressComment','deliveryAddress',p_data->'deliveryAddress')) where id=row_id and store_id=p_store;end if;
  end if;
 insert into private.totus_local_workspace_requests(id,actor_id,store_id,intent,result) values(p_request,actor,p_store,intent,result);
 return result;
end $function$
;
commit;
