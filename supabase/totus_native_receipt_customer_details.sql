begin;
set local lock_timeout='5s';
alter table public.ops_customers add column if not exists details jsonb not null default '{}'::jsonb;
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
  if btrim(coalesce(p_data->>'name',''))='' or char_length(p_data->>'name')>255 or btrim(coalesce(p_data->>'reference',''))='' or char_length(p_data->>'reference')>120 then raise exception 'Indica nombre y referencia válidos.';end if;
  unit:=coalesce(p_data->>'unit','unit');if unit not in('unit','kg','l','m') then raise exception 'Unidad no válida.';end if;
  price:=(p_data->>'priceCents')::bigint;tax:=(p_data->>'taxBasisPoints')::int;qty:=(p_data->>'stock')::numeric;
  if price<0 or price>999999999 or tax<0 or tax>10000 or qty<0 or qty>999999999.999 or qty<>round(qty,case when unit='unit' then 0 else 3 end) then raise exception 'Revisa precio, IVA y existencias.';end if;
  if nullif(p_data->>'brandId','') is not null and not exists(select 1 from public.brands where id=(p_data->>'brandId')::uuid and store_id=p_store) then raise exception 'La marca no pertenece a esta tienda.';end if;
  variant_count:=jsonb_array_length(coalesce(p_data->'variants','[]'));if variant_count>100 then raise exception 'Máximo 100 variantes por guardado.';end if;
  if p_id is not null then perform 1 from private.totus_tpv_local_catalogue where store_id=p_store and product_id=p_id order by id for update; if p_data?'catalogueRevisions' and exists(select 1 from private.totus_tpv_local_catalogue c where c.store_id=p_store and c.product_id=p_id and (p_data#>>array['catalogueRevisions',c.id::text])::bigint is distinct from c.revision) then raise exception 'Las existencias han cambiado mientras editabas. Vuelve a abrir la ficha.';end if;end if;
  if p_id is not null and exists(select 1 from public.product_variants v where v.product_id=p_id and not exists(select 1 from jsonb_array_elements(p_data->'variants') x where x->>'id'=v.id::text)) then raise exception 'Conserva todas las combinaciones existentes para proteger su stock e historial.';end if;
  if p_id is not null and p_data->>'expectedRevision' is distinct from (select updated_at::text from public.products where id=p_id) and (p_data->>'expectedRevision')::timestamptz is distinct from (select updated_at from public.products where id=p_id) then raise exception 'La ficha ha cambiado. Vuelve a abrirla antes de guardar.';end if;
  if nullif(p_data->>'supplierId','') is not null and not exists(select 1 from public.ops_suppliers where id=(p_data->>'supplierId')::uuid and store_id=p_store) then raise exception 'El proveedor no pertenece a esta tienda.';end if;
  insert into public.products(id,store_id,sku,name,product_type,status,current_pvp,brand_id,supplier_id,details,created_by) values(row_id,p_store,btrim(p_data->>'reference'),btrim(p_data->>'name'),case when variant_count>0 then 'variants' else 'simple' end,'ACEPTADO',price/100.0,nullif(p_data->>'brandId','')::uuid,nullif(p_data->>'supplierId','')::uuid,p_data-array['variants','expectedRevision'],actor)
  on conflict(id) do update set name=excluded.name,sku=excluded.sku,current_pvp=excluded.current_pvp,brand_id=excluded.brand_id,supplier_id=excluded.supplier_id,details=excluded.details,updated_at=now() returning * into product_row;
  if variant_count=0 then
   select * into catalogue_row from private.totus_tpv_local_catalogue c where c.store_id=p_store and c.product_id=row_id and c.variant_id is null for update;
   perform public.totus_tpv_local_catalogue_save(gen_random_uuid(),p_store,coalesce(catalogue_row.id,row_id),row_id,null,jsonb_build_object('name',product_row.name,'reference',product_row.sku,'ean',coalesce(p_data->>'ean',''),'priceCents',price,'taxBasisPoints',tax,'stock',qty,'quantityUnit',unit,'metadata',jsonb_build_object('brandId',product_row.brand_id),'active',coalesce((p_data->>'active')::boolean,true)),coalesce(catalogue_row.revision,0));
  else
   for variant in select value from jsonb_array_elements(p_data->'variants') loop
    attributes:=variant->'attributes';if jsonb_typeof(attributes)<>'object' or attributes='{}' or length(attributes::text)>2000 or btrim(coalesce(variant->>'reference',''))='' then raise exception 'Cada variante necesita referencia y atributos.';end if;
    v_variant:=coalesce(nullif(variant->>'id','')::uuid,gen_random_uuid());
    if variant?'id' and not exists(select 1 from public.product_variants v where v.id=v_variant and v.product_id=row_id) then raise exception 'La combinación no pertenece al producto.';end if;
    insert into public.product_variants(id,product_id,sku,name,attributes,pvp) values(v_variant,row_id,btrim(variant->>'reference'),(select string_agg(key||': '||value,' · ' order by key) from jsonb_each_text(attributes)),attributes,(variant->>'priceCents')::bigint/100.0) on conflict(id) do update set sku=excluded.sku,name=excluded.name,attributes=excluded.attributes,pvp=excluded.pvp;
    select * into catalogue_row from private.totus_tpv_local_catalogue c where c.store_id=p_store and c.id=v_variant for update;
    perform public.totus_tpv_local_catalogue_save(gen_random_uuid(),p_store,v_variant,row_id,v_variant,jsonb_build_object('name',product_row.name||' · '||(select name from public.product_variants where id=v_variant),'reference',variant->>'reference','ean',coalesce(variant->>'ean',''),'priceCents',(variant->>'priceCents')::bigint,'taxBasisPoints',tax,'stock',(variant->>'stock')::numeric,'quantityUnit',unit,'metadata',jsonb_build_object('attributes',attributes,'brandId',product_row.brand_id),'active',true),coalesce(catalogue_row.revision,0));
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
CREATE OR REPLACE FUNCTION totus_tpv_internal.local_issue_receipt()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare series private.totus_tpv_store_receipt_series;v_number bigint;v_prefix text;merchant jsonb;customer jsonb;doc jsonb;items jsonb;totals jsonb;attempts integer:=0;
begin
 perform pg_advisory_xact_lock(hashtextextended('tpv-store-series:'||new.store_id::text,0));
 insert into private.totus_tpv_store_receipt_series(store_id,enabled,sale_prefix,return_prefix,last_sale,last_return) values(new.store_id,false,'V','D',0,0) on conflict do nothing;
 select * into series from private.totus_tpv_store_receipt_series where store_id=new.store_id for update;
 v_number:=series.last_sale+1;v_prefix:=series.sale_prefix;
 while exists(select 1 from private.totus_tpv_receipt_numbers where store_id=new.store_id and kind='sale' and (number=v_number or prefix||number::text=v_prefix||v_number::text))
 or exists(select 1 from private.totus_tpv_local_documents where store_id=new.store_id and (number=v_number or prefix||number::text=v_prefix||v_number::text)) loop
  v_number:=v_number+1;attempts:=attempts+1;if attempts>1000 then raise exception 'TPV_RECEIPT_COUNTER_EXHAUSTED';end if;
 end loop;
 if v_number>999999999 then raise exception 'TPV_RECEIPT_COUNTER_EXHAUSTED';end if;
 update private.totus_tpv_store_receipt_series set last_sale=v_number,revision=revision+1,updated_at=clock_timestamp() where store_id=new.store_id;
 select jsonb_build_object('name',s.name,'address',coalesce(to_jsonb(s)->>'address',''),'phone',coalesce(to_jsonb(s)->>'phone','')) into merchant from public.ops_stores s where s.id=new.store_id;
 if new.customer_id is not null then
 select jsonb_build_object('email',coalesce(c.email,''),'invoice',jsonb_build_object('name',c.name,'address1',coalesce(c.address,''),'postcode',coalesce(c.postal_code,''),'city',coalesce(c.city,''),'country',coalesce(c.country,''),'phone',coalesce(c.phone,''),'taxId',coalesce(c.tax_id,''),'company',coalesce(c.details->>'company',''),'comment',coalesce(c.details->>'comment','')),
 'delivery',case when nullif(c.details->>'deliveryAddress','') is not null then jsonb_build_object('name',c.name,'address1',c.details->>'deliveryAddress','country',coalesce(c.country,'')) else null end) into customer from public.ops_customers c where c.id=new.customer_id and c.store_id=new.store_id;
 end if;
 select jsonb_agg(jsonb_build_object('name',line->'name','reference',line->'reference','quantity',line->'qty','quantity_unit',coalesce(line->>'quantityUnit','unit'),'line_cents',line->'totalCents','tax_excl_cents',line->'netCents','tax_cents',(line->>'totalCents')::bigint-(line->>'netCents')::bigint,'unit_tax_incl_micros',(line->>'unitCents')::bigint*10000,'original_unit_tax_incl_micros',coalesce((line->>'originalUnitCents')::bigint,(line->>'unitCents')::bigint)*10000,'original_line_cents',round(coalesce((line->>'originalUnitCents')::numeric,(line->>'unitCents')::numeric)*(line->>'qty')::numeric)::bigint,'line_discount_cents',greatest(0,round(coalesce((line->>'originalUnitCents')::numeric,(line->>'unitCents')::numeric)*(line->>'qty')::numeric)::bigint-(line->>'totalCents')::bigint-coalesce((line->>'couponDiscountCents')::bigint,0)),'base_name',case when line->>'nameOverride'='true' then line->>'name' else coalesce((select p.name from private.totus_tpv_local_catalogue c join public.products p on p.id=c.product_id where c.store_id=new.store_id and c.id=(line->>'productId')::uuid),line->>'name') end,'variant_name',case when line->>'nameOverride'='true' then '' else coalesce((select string_agg(a.key||': '||a.value,' · ' order by a.key) from private.totus_tpv_local_catalogue c join public.product_variants v on v.id=c.variant_id cross join lateral jsonb_each_text(v.attributes) a where c.store_id=new.store_id and c.id=(line->>'productId')::uuid),'') end,'group_reduction_percent_micros',0,'unit_measure',case when coalesce(line->>'quantityUnit','unit')<>'unit' then jsonb_build_object('label',line->>'quantityUnit','price_micros',(line->>'unitCents')::bigint*10000) else null end)) into items from jsonb_array_elements(new.snapshot->'lines')line;
 select coalesce(jsonb_object_agg(method,cents),'{}'::jsonb) into totals from(select payment->>'method' method,sum((payment->>'amountCents')::bigint) cents from jsonb_array_elements(new.submission->'payments') payment group by payment->>'method') grouped;
 doc:=jsonb_build_object('kind','receipt','existing_document',true,'central_sale',true,'sale_id',new.id,'order_id',v_number,'reference',v_prefix||v_number::text,'ticket_number',jsonb_build_object('kind','sale','number',v_number,'prefix',v_prefix,'label',v_prefix||v_number::text),'currency','EUR','created_at',new.created_at,'merchant',merchant,'lines',items,'payments',totals,'payment_intent',new.submission->'payments','total_cents',new.total_cents,'total_tax_excl_cents',new.snapshot->'productsNetCents','fee_cents',coalesce((new.snapshot->>'feeCents')::bigint,0),'tax_breakdown_complete',coalesce((new.snapshot->>'feeCents')::bigint,0)=0,'paid_at_issue_cents',new.paid_cents,'outstanding_at_issue_cents',new.total_cents-new.paid_cents,'line_discounts_complete',true);
 doc:=doc||jsonb_build_object('operator_name',coalesce((select full_name from public.profiles where id=new.actor_id),'Operador'),'line_discount_cents',coalesce((select sum((x->>'line_discount_cents')::bigint) from jsonb_array_elements(items) x),0),'discount_cents',coalesce((new.snapshot->>'discountCents')::bigint,0),'vouchers',case when new.snapshot?'couponCode' then jsonb_build_array(jsonb_build_object('name','Vale '||(new.snapshot->>'couponCode'),'amount_cents',(new.snapshot->>'discountCents')::bigint)) else '[]'::jsonb end,'vouchers_complete',true); if customer is not null then doc:=doc||jsonb_build_object('customer',customer,'customer_extra',jsonb_build_object('field','taxId','value',coalesce(customer#>>'{invoice,taxId}','')));end if;
 insert into private.totus_tpv_local_documents(sale_id,store_id,number,prefix,data) values(new.id,new.store_id,v_number,v_prefix,doc);
 return new;
end $function$
;
CREATE OR REPLACE FUNCTION public.totus_tpv_local_document(p_drawer uuid, p_sale uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare actor uuid:=totus_tpv_internal.local_authorize(p_drawer,'view');store uuid;doc jsonb;extra_field text;
begin
 select store_id into store from public.ops_cash_drawers where id=p_drawer;
 select data into doc from private.totus_tpv_local_documents where sale_id=p_sale and store_id=store;
 if not found then raise exception 'TPV_LOCAL_DOCUMENT_NOT_FOUND';end if;
 if private.totus_can('facturacion','view') is not true then doc:=doc-'customer'-'customer_extra'-'loyalty';end if;
 if private.totus_can('facturacion','view') is true and exists(select 1 from private.totus_tpv_loyalty_settings where store_id=store and show_points) then
 doc:=doc||jsonb_build_object('loyalty',(select jsonb_build_object('earnedPoints',earned_points,'balanceAfterSale',balance_after_sale,'reversedPoints',reversed_points) from private.totus_tpv_local_loyalty_awards where sale_id=p_sale));end if;
 doc:=doc||jsonb_build_object('promotion',(select jsonb_build_object('code',code,'issuedCents',issued_cents,'amountCents',available_cents,'minimumCents',minimum_cents,'expiresAt',expires_at,'status',case when used_sale is not null then 'used' when expires_at<=now() then 'expired' when available_cents=0 then 'cancelled' else 'available' end) from private.totus_tpv_local_promotions where source_sale=p_sale));
 if private.totus_can('facturacion','view') is true and doc->'customer' is not null then
 select coalesce(receipt_options->>'customerExtraField','taxId') into extra_field from private.totus_tpv_general_templates where drawer_id=p_drawer;
 extra_field:=coalesce(extra_field,'taxId');if extra_field not in('taxId','company','comment') then extra_field:='taxId';end if;
 doc:=doc||jsonb_build_object('customer_extra',jsonb_build_object('field',extra_field,'value',coalesce(doc#>>array['customer','invoice',extra_field],'')));
 end if;
 return doc;
end $function$
;
commit;