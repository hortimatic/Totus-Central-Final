-- Incorporation is invoked by a user action; installation seeds no business data.
begin;
-- Negative imported inventory is a real state, not a positive sale quantity.
alter table private.totus_tpv_local_catalogue drop constraint if exists totus_tpv_local_catalogue_stock_check;
alter table private.totus_tpv_local_catalogue add constraint totus_tpv_local_catalogue_stock_check check(stock between -999999999.999 and 999999999.999);
create index if not exists totus_web_combinations_parent on private.totus_web_source_records(website_key,(data->>'id_product')) where resource='combinations';
create index if not exists totus_web_stock_product on private.totus_web_source_records(website_key,(data->>'id_product'),(data->>'id_product_attribute')) where resource='stock_availables';
create table if not exists private.totus_web_product_projection(
 website_key text not null references private.totus_websites(key),source_id bigint not null,
 product_id uuid not null references public.products(id) on delete cascade,
 source_hash text not null,target_hash text not null,conflict boolean not null default false,
 updated_at timestamptz not null default now(),primary key(website_key,source_id)
);
alter table private.totus_web_product_projection enable row level security;
revoke all on private.totus_web_product_projection from public,anon,authenticated;
create or replace function private.totus_web_product_target(p_id uuid) returns jsonb language sql stable security invoker set search_path='' as $$
 select jsonb_build_object('product',to_jsonb(p)-array['created_at','updated_at'],
  'variants',coalesce((select jsonb_agg(to_jsonb(v)-'created_at' order by v.id) from public.product_variants v where v.product_id=p.id),'[]'),
  'catalogue',coalesce((select jsonb_agg(to_jsonb(c) order by c.id) from private.totus_tpv_local_catalogue c where c.product_id=p.id),'[]')) from public.products p where p.id=p_id
$$;
revoke all on function private.totus_web_product_target(uuid) from public,anon,authenticated;
create or replace function private.totus_web_product_projection(p_website text,p_cursor bigint default 0,p_apply boolean default false) returns jsonb language plpgsql security definer set search_path='' as $body$
<<projection>>
declare w private.totus_websites;j private.totus_web_native_catalogue_jobs;r record;combination_row private.totus_web_source_records;item record;
 entry private.totus_web_product_projection;target jsonb;source_hash text;product_id uuid;variant_id uuid;brand_id uuid;supplier_id uuid;
 native jsonb;prices jsonb;combinations jsonb;attributes jsonb;details jsonb;tax integer;incl numeric;excl numeric;price bigint;
 n integer:=0;conflicts integer:=0;last_id bigint:=p_cursor;more boolean;variant_count integer;label text;missing integer;
begin
 if auth.uid() is null then raise exception 'Inicia sesión.';end if;perform private.totus_api_admin();
 select * into strict w from private.totus_websites where key=p_website;
 if w.business_id is null or private.totus_local_store_access(w.business_id) is not true then raise exception 'Selecciona un establecimiento accesible.';end if;
 select * into j from private.totus_web_native_catalogue_jobs where website_key=w.key order by created_at desc limit 1;
 if not p_apply then return jsonb_build_object('storeId',w.business_id,'sourceProducts',(select count(*) from private.totus_web_source_records where website_key=w.key and resource='products'),
  'incorporated',(select count(*) from public.products where source_website=w.key),'conflicts',(select count(*) from private.totus_web_product_projection where website_key=w.key and conflict),
  'pricesReady',coalesce(j.state='completed',false),'orphanCombinations',(select count(*) from private.totus_web_source_records v where v.website_key=w.key and v.resource='combinations' and not exists(select 1 from private.totus_web_source_records p where p.website_key=w.key and p.resource='products' and p.source_id=nullif(v.data->>'id_product','')::bigint)));end if;
 if p_cursor is null or p_cursor<0 or private.totus_can('productos','create') is not true or private.totus_can('productos','edit') is not true then raise exception 'No tienes permiso para incorporar el catálogo.';end if;
 if j.id is null or j.state<>'completed' then raise exception 'Termina la preparación de precios y combinaciones antes de incorporar el catálogo.';end if;
 if exists(select 1 from private.totus_web_import_jobs where website_key=w.key and state in ('running','paused')) then raise exception 'Termina o cancela la importación activa.';end if;
 perform pg_advisory_xact_lock(hashtextextended('web-products:'||w.key,0));
 perform pg_advisory_xact_lock(hashtextextended('web-import:'||w.key,0));
 perform 1 from public.ops_stores where id=w.business_id for key share;
 for r in select * from private.totus_web_source_records where website_key=w.key and resource='products' and source_id>p_cursor order by source_id limit 25 loop
  last_id:=r.source_id;
  select coalesce(jsonb_agg(data order by source_id),'[]') into combinations from private.totus_web_source_records where website_key=w.key and resource='combinations' and data->>'id_product'=r.source_id::text;
  select coalesce(jsonb_agg(nc.data order by nc.attribute_id),'[]') into prices from private.totus_web_native_catalogue_items nc where nc.website_key=w.key and nc.shop_id=j.shop_id and nc.product_id=r.source_id and nc.job_id=j.id;
  select p.id into brand_id from public.brands p where p.source_website=w.key and p.source_id=nullif(r.data->>'id_manufacturer','')::bigint;
  select p.id into supplier_id from public.ops_suppliers p where p.source_website=w.key and p.source_id=nullif(r.data->>'id_supplier','')::bigint;
  if coalesce(nullif(r.data->>'id_manufacturer','')::bigint,0)>0 and brand_id is null or coalesce(nullif(r.data->>'id_supplier','')::bigint,0)>0 and supplier_id is null then raise exception 'Incorpora las marcas y proveedores antes del catálogo.';end if;
  source_hash:=md5(jsonb_build_object('product',r.data,'variants',combinations,'prices',prices,'brand',brand_id,'supplier',supplier_id)::text);
  select * into entry from private.totus_web_product_projection where website_key=w.key and source_id=r.source_id for update;
  select p.id into product_id from public.products p where p.source_website=w.key and p.source_id=r.source_id for update;
  perform 1 from private.totus_tpv_local_catalogue c where c.product_id=projection.product_id order by c.id for update;
  perform 1 from public.product_variants pv where pv.product_id=projection.product_id order by pv.id for update;
  if product_id is not null and not exists(select 1 from public.products p where p.id=projection.product_id and p.store_id=w.business_id) then raise exception 'El producto ya está asignado a otro establecimiento.';end if;
  target:=private.totus_web_product_target(projection.product_id);
  if target is not null then
   if entry.product_id is null then raise exception 'Hay un producto sin seguimiento de importación.';end if;
   if entry.source_hash=source_hash then n:=n+1;continue;end if;
   if entry.target_hash<>md5(target::text) then update private.totus_web_product_projection set conflict=true,updated_at=now() where website_key=w.key and source_id=r.source_id;conflicts:=conflicts+1;continue;end if;
  end if;
  if prices='[]' then raise exception 'Falta el precio nativo del producto %.',r.source_id;end if;
  variant_count:=jsonb_array_length(combinations);
  select value into native from jsonb_array_elements(prices) order by (value->>'attribute_id'=coalesce(nullif(r.data->>'cache_default_attribute',''),nullif(r.data->>'id_default_combination',''),'0')) desc,(value->>'attribute_id')::bigint limit 1;
  price:=(native->>'preview_cents')::bigint;
  details:=jsonb_build_object('sourceData',r.data,'metaTitle',coalesce(r.data->>'meta_title',''),'metaDescription',coalesce(r.data->>'meta_description',''),'slug',coalesce(r.data->>'link_rewrite',''),'description',coalesce(r.data->>'description',''),'descriptionShort',coalesce(r.data->>'description_short',''),'images',coalesce(r.data#>'{associations,images}','[]'),'categories',coalesce(r.data#>'{associations,categories}','[]'),'currency',j.profile->>'currency','nativePrice',native);
  product_id:=coalesce(product_id,gen_random_uuid());
  insert into public.products(id,store_id,source_website,source_id,sku,name,product_type,status,current_pvp,brand_id,supplier_id,details,created_by)
   values(projection.product_id,w.business_id,w.key,r.source_id,coalesce(r.data->>'reference',''),r.data->>'name',case when variant_count>0 then 'variants' else 'simple' end,'ACEPTADO',price/100.0,brand_id,supplier_id,details,auth.uid())
   on conflict(id) do update set sku=excluded.sku,name=excluded.name,product_type=excluded.product_type,current_pvp=excluded.current_pvp,brand_id=excluded.brand_id,supplier_id=excluded.supplier_id,details=excluded.details,updated_at=now();
  for item in select nc.* from private.totus_web_native_catalogue_items nc where nc.website_key=w.key and nc.shop_id=j.shop_id and nc.job_id=j.id and nc.product_id=r.source_id and (variant_count=0 and nc.attribute_id=0 or variant_count>0 and nc.attribute_id>0) order by nc.attribute_id loop
   native:=item.data;incl:=(native->>'unit_tax_incl')::numeric;excl:=(native->>'unit_tax_excl')::numeric;
   if excl>0 then tax:=round((incl/excl-1)*10000);elsif incl=0 and coalesce(nullif(r.data->>'id_tax_rules_group','')::bigint,0)=0 then tax:=0;
   else
    select case when count(distinct (t.data->>'rate')::numeric)=1 then round(min((t.data->>'rate')::numeric)*100) else null end into tax from private.totus_web_source_records rules join private.totus_web_source_records t on t.website_key=rules.website_key and t.resource='taxes' and t.source_id=nullif(rules.data->>'id_tax','')::bigint
     where rules.website_key=w.key and rules.resource='tax_rules' and rules.data->>'id_tax_rules_group'=r.data->>'id_tax_rules_group' and rules.data->>'id_country'=j.profile#>>'{pricing_context,countryId}';
   end if;
   if tax is null or tax<0 or tax>10000 then raise exception 'No se ha podido determinar el impuesto del producto %.',r.source_id;end if;
   variant_id:=null;attributes:='{}';label:=r.data->>'name';
   if item.attribute_id>0 then
    select * into strict combination_row from private.totus_web_source_records where website_key=w.key and resource='combinations' and source_id=item.attribute_id and data->>'id_product'=r.source_id::text;
    select coalesce(jsonb_object_agg(g.data->>'name',a.data->>'name'),'{}') into attributes from jsonb_array_elements(coalesce(combination_row.data#>'{associations,product_option_values}','[]')) x
     join private.totus_web_source_records a on a.website_key=w.key and a.resource='product_option_values' and a.source_id=(x->>'id')::bigint
     join private.totus_web_source_records g on g.website_key=w.key and g.resource='product_options' and g.source_id=nullif(a.data->>'id_attribute_group','')::bigint;
    label:=coalesce((select string_agg(key||': '||value,' · ' order by key) from jsonb_each_text(attributes)),native->>'variant_name','Combinación #'||item.attribute_id);
    select p.id into variant_id from public.product_variants p where p.source_website=w.key and p.source_id=item.attribute_id for update;
    variant_id:=coalesce(variant_id,gen_random_uuid());
    insert into public.product_variants(id,product_id,source_website,source_id,sku,name,attributes,pvp,cost_net,active) values(variant_id,projection.product_id,w.key,item.attribute_id,coalesce(combination_row.data->>'reference',''),label,attributes,(native->>'preview_cents')::bigint/100.0,nullif(combination_row.data->>'wholesale_price','')::numeric,coalesce(native->>'enabled_for_sale','true')='true')
     on conflict(id) do update set sku=excluded.sku,name=excluded.name,attributes=excluded.attributes,pvp=excluded.pvp,cost_net=excluded.cost_net,active=excluded.active;
    label:=(r.data->>'name')||' · '||label;
   end if;
   insert into private.totus_tpv_local_catalogue(store_id,id,product_id,variant_id,name,reference,ean,price_cents,tax_basis_points,stock,metadata,active,quantity_unit)
    values(w.business_id,coalesce(variant_id,projection.product_id),projection.product_id,variant_id,label,coalesce(native->>'reference',''),coalesce(native->>'ean',''),(native->>'preview_cents')::bigint,tax,(native->>'stock')::numeric,jsonb_build_object('sourceWebsite',w.key,'sourceProductId',r.source_id,'sourceVariantId',item.attribute_id,'attributes',attributes,'nativePrice',native,'currency',j.profile->>'currency','brandId',brand_id),coalesce(native->>'enabled_for_sale','true')='true','unit')
    on conflict(store_id,id) do update set name=excluded.name,reference=excluded.reference,ean=excluded.ean,price_cents=excluded.price_cents,tax_basis_points=excluded.tax_basis_points,stock=excluded.stock,metadata=excluded.metadata,active=excluded.active,revision=private.totus_tpv_local_catalogue.revision+1;
  end loop;
  select count(*) into missing from jsonb_array_elements(combinations) c where not exists(select 1 from public.product_variants p where p.source_website=w.key and p.source_id=(c->>'id')::bigint and p.product_id=projection.product_id);
  if missing>0 then raise exception 'Faltan % combinaciones del producto %. No se ha confirmado este lote.',missing,r.source_id;end if;
  target:=private.totus_web_product_target(projection.product_id);
  insert into private.totus_web_product_projection(website_key,source_id,product_id,source_hash,target_hash) values(w.key,r.source_id,projection.product_id,source_hash,md5(target::text))
   on conflict(website_key,source_id) do update set product_id=excluded.product_id,source_hash=excluded.source_hash,target_hash=excluded.target_hash,conflict=false,updated_at=now();
  n:=n+1;
 end loop;
 select exists(select 1 from private.totus_web_source_records where website_key=w.key and resource='products' and source_id>last_id) into more;
 return jsonb_build_object('cursor',last_id,'processed',n,'conflicts',conflicts,'more',more,'storeId',w.business_id);
end $body$;
revoke all on function private.totus_web_product_projection(text,bigint,boolean) from public,anon;
grant execute on function private.totus_web_product_projection(text,bigint,boolean) to authenticated;
create or replace function public.totus_web_product_projection(p_website text,p_cursor bigint default 0,p_apply boolean default false) returns jsonb language sql security invoker set search_path='' as $$select private.totus_web_product_projection(p_website,p_cursor,p_apply)$$;
revoke all on function public.totus_web_product_projection(text,bigint,boolean) from public,anon;
grant execute on function public.totus_web_product_projection(text,bigint,boolean) to authenticated;
commit;
