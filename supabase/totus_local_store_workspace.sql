-- Native store ownership and user-facing catalogue/directory workflows. No seed data.
alter table public.products add column if not exists store_id uuid references public.ops_stores(id) on delete restrict;
alter table public.brands add column if not exists store_id uuid references public.ops_stores(id) on delete restrict;
alter table public.ops_customers add column if not exists store_id uuid references public.ops_stores(id) on delete restrict;
alter table public.ops_suppliers add column if not exists store_id uuid references public.ops_stores(id) on delete restrict;
alter table public.products add column if not exists brand_id uuid references public.brands(id) on delete set null;
alter table public.products add column if not exists details jsonb not null default '{}';
alter table public.products add column if not exists supplier_id uuid references public.ops_suppliers(id) on delete set null;
create index if not exists products_store_idx on public.products(store_id);
create index if not exists customers_store_idx on public.ops_customers(store_id);
create index if not exists suppliers_store_idx on public.ops_suppliers(store_id);
create index if not exists brands_store_idx on public.brands(store_id);
create table if not exists private.totus_local_workspace_requests(id uuid primary key,actor_id uuid not null,store_id uuid not null references public.ops_stores(id) on delete cascade,intent jsonb not null,result jsonb not null,created_at timestamptz not null default now());
alter table private.totus_local_workspace_requests enable row level security;
revoke all on private.totus_local_workspace_requests from public,anon,authenticated;

create or replace function private.totus_local_store_access(p_store uuid) returns boolean language sql stable security definer set search_path='' as $$
 select auth.uid() is not null and exists(select 1 from public.profiles p where p.id=auth.uid() and p.active and (p.role='admin' or exists(select 1 from public.ops_cash_drawers d join private.totus_tpv_general_templates t on t.drawer_id=d.id cross join lateral jsonb_array_elements(coalesce(t.cash_setup->'operators','[]')) a where d.store_id=p_store and d.active and a->>'actorId'=p.id::text and (coalesce((a->>'sell')::boolean,false) or coalesce((a->>'open')::boolean,false) or coalesce((a->>'reconcile')::boolean,false))))) and exists(select 1 from public.ops_stores s where s.id=p_store and s.active)
$$;
revoke all on function private.totus_local_store_access(uuid) from public,anon,authenticated;

create or replace function public.totus_local_store_workspace(p_store uuid default null,p_kind text default 'context',p_action text default 'list',p_id uuid default null,p_request uuid default null,p_data jsonb default '{}') returns jsonb language plpgsql security definer set search_path='' as $fn$
declare actor uuid:=auth.uid();module_name text;table_name text;items jsonb;result jsonb;intent jsonb;prior private.totus_local_workspace_requests;row_id uuid;variant jsonb;v_variant uuid;item_id uuid;attributes jsonb;unit text;price bigint;tax integer;qty numeric;variant_count integer;product_row public.products;catalogue_row private.totus_tpv_local_catalogue;store_row record;
begin
 if actor is null or not exists(select 1 from public.profiles where id=actor and active) then raise exception 'Necesitas una sesión activa.';end if;
 if p_kind='context' and p_action='list' then
  select coalesce(jsonb_agg(jsonb_build_object('id',s.id,'name',s.name,'code',s.code) order by s.sort_order,s.name),'[]') into items from public.ops_stores s where private.totus_local_store_access(s.id);
  return jsonb_build_object('stores',items);
 end if;
 module_name:=case p_kind when 'products' then 'productos' when 'customers' then 'facturacion' when 'suppliers' then 'gastos' when 'brands' then 'pricing' when 'summary' then 'inicio' else null end;
 if module_name is null or p_action not in('list','save','delete') or private.totus_can(module_name,case p_action when 'list' then 'view' when 'delete' then 'delete' else case when p_id is null then 'create' else 'edit' end end) is not true or private.totus_local_store_access(p_store) is not true then raise exception 'No tienes acceso a esta tienda o a esta operación.';end if;
 perform 1 from public.ops_stores where id=p_store for key share;
 if p_kind='summary' and p_action='list' then
  return jsonb_build_object('storeId',p_store,'products',(select count(*) from public.products where store_id=p_store),'customers',(select count(*) from public.ops_customers where store_id=p_store),'suppliers',(select count(*) from public.ops_suppliers where store_id=p_store),'stock',(select coalesce(sum(stock),0) from private.totus_tpv_local_catalogue where store_id=p_store and active),'sales',(select count(*) from private.totus_tpv_local_sales where store_id=p_store),'salesCents',(select coalesce(sum(total_cents),0) from private.totus_tpv_local_sales where store_id=p_store),'collectedCents',(select coalesce(sum(p.amount_cents),0) from private.totus_tpv_local_payments p join private.totus_tpv_local_sales s on s.id=p.sale_id where s.store_id=p_store));
 end if;
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
 insert into private.totus_local_workspace_requests(id,actor_id,store_id,intent,result) values(p_request,actor,p_store,intent,result);
 return result;
end $fn$;
revoke all on function public.totus_local_store_workspace(uuid,text,text,uuid,uuid,jsonb) from public,anon;
grant execute on function public.totus_local_store_workspace(uuid,text,text,uuid,uuid,jsonb) to authenticated;

create or replace function public.totus_tpv_local_customers(p_drawer uuid,p_search text default '',p_offset integer default 0,p_customer uuid default null) returns jsonb language plpgsql security definer set search_path='' as $$
declare actor uuid:=totus_tpv_internal.local_authorize(p_drawer,'view');rows jsonb;shop uuid;
begin
 if private.totus_can('facturacion','view') is not true then raise exception 'TPV_LOCAL_CUSTOMER_FORBIDDEN';end if;
 if p_search is null or char_length(p_search)>150 or p_offset is null or p_offset<0 or p_offset>1000000 then raise exception 'TPV_LOCAL_QUERY_INVALID';end if;
 select store_id into shop from public.ops_cash_drawers where id=p_drawer;
 select coalesce(jsonb_agg(x.data order by x.name,x.id),'[]'::jsonb) into rows from (select c.id,c.name,jsonb_build_object('id',c.id,'name',c.name,'addressLabel',concat_ws(', ',nullif(c.address,''),nullif(c.city,''))) data from public.ops_customers c where c.active and c.store_id=shop and (p_customer is null or c.id=p_customer) and (p_search='' or position(lower(p_search) in lower(c.name||' '||coalesce(c.tax_id,'')||' '||coalesce(c.email,'')))>0) order by c.name,c.id limit 51 offset p_offset)x;
 return jsonb_build_object('items',case when jsonb_array_length(rows)>50 then rows-50 else rows end,'hasMore',jsonb_array_length(rows)>50,'offset',p_offset);
end $$;

create or replace function private.totus_native_customer_scope() returns trigger language plpgsql security definer set search_path='' as $$
declare customer uuid;shop uuid;
begin
 if tg_table_name='totus_tpv_local_sales' then customer:=new.customer_id;shop:=new.store_id;
 elsif tg_table_name='totus_tpv_local_drafts' then customer:=nullif(new.payload->>'customerId','')::uuid;select store_id into shop from public.ops_cash_drawers where id=new.drawer_id;
 else customer:=nullif(new.intent->>'customerId','')::uuid;select store_id into shop from private.totus_tpv_local_sessions where id=new.session_id;end if;
 if customer is not null and not exists(select 1 from public.ops_customers c where c.id=customer and c.active and c.store_id=shop) then raise exception 'El cliente no pertenece a la tienda de esta caja.';end if;
 return new;
end $$;
revoke all on function private.totus_native_customer_scope() from public,anon,authenticated;
drop trigger if exists local_customer_scope on private.totus_tpv_local_sales;
create trigger local_customer_scope before insert or update on private.totus_tpv_local_sales for each row execute function private.totus_native_customer_scope();
drop trigger if exists local_customer_scope on private.totus_tpv_local_quotes;
create trigger local_customer_scope before insert or update on private.totus_tpv_local_quotes for each row execute function private.totus_native_customer_scope();
drop trigger if exists local_customer_scope on private.totus_tpv_local_drafts;
create trigger local_customer_scope before insert or update on private.totus_tpv_local_drafts for each row execute function private.totus_native_customer_scope();
