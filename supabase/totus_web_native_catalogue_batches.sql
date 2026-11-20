-- Upgrade the user-facing native preparation to cursor batches, not individual products.
-- The previous preparation was cancelled through the interface; its records are retained.
begin;
create or replace function private.totus_web_catalogue_targets(p_web text,p_phase text,p_cursor bigint,p_shop bigint,p_job uuid) returns jsonb language sql stable security invoker set search_path='' as $$
 select coalesce(jsonb_agg(jsonb_build_object('id',x.id,'productId',x.product_id,'attributeId',x.attribute_id,'product',x.product,'variant',x.variant,'stock',coalesce((select nullif(s.data->>'quantity','')::numeric from private.totus_web_source_records s where s.website_key=p_web and s.resource='stock_availables' and s.data->>'id_product'=x.product_id::text and s.data->>'id_product_attribute'=x.attribute_id::text order by (s.data->>'id_shop'=p_shop::text) desc nulls last,s.source_id limit 1),0)) order by x.id),'[]') from (
  select v.source_id id,p.source_id product_id,v.source_id attribute_id,p.data product,v.data variant from private.totus_web_source_records v join private.totus_web_source_records p on p.website_key=v.website_key and p.resource='products' and p.source_id=nullif(v.data->>'id_product','')::bigint where p_phase='variants' and v.website_key=p_web and v.resource='combinations' and v.source_id>p_cursor
  union all
  select p.source_id,p.source_id,0,p.data,p.data from private.totus_web_source_records p where p_phase='remaining' and p.website_key=p_web and p.resource='products' and p.source_id>p_cursor and not exists(select 1 from private.totus_web_native_catalogue_items i where i.website_key=p_web and i.shop_id=p_shop and i.job_id=p_job and i.product_id=p.source_id)
  order by id limit 25
 ) x
$$;
revoke all on function private.totus_web_catalogue_targets(text,text,bigint,bigint,uuid) from public,anon,authenticated;
create or replace function private.totus_web_native_catalogue(p_website text,p_action text default 'status',p_job uuid default null,p_shop bigint default null) returns jsonb language plpgsql security definer set search_path='' as $$
declare w private.totus_websites;c private.totus_api_connections;j private.totus_web_native_catalogue_jobs;targets jsonb;shops jsonb;pricing jsonb;
begin
 if auth.uid() is null then raise exception 'Inicia sesión.';end if;perform private.totus_api_admin();
 select * into strict w from private.totus_websites where key=p_website;
 select * into strict c from private.totus_api_connections where id=w.connection_id;
 if w.business_id is null or private.totus_local_store_access(w.business_id) is not true then raise exception 'Asigna un establecimiento accesible.';end if;
 perform pg_advisory_xact_lock(hashtextextended('web-native-catalogue:'||w.key,0));
 if p_action='start' then
  if w.status<>'active' or not c.enabled or c.verified_revision is distinct from c.revision or not c.real_data_authorized then raise exception 'Verifica y activa la conexión.';end if;
  if p_job is null or p_shop is null or not exists(select 1 from private.totus_web_source_records where website_key=w.key and resource='shops' and source_id=p_shop) then raise exception 'Selecciona la tienda importada.';end if;
  select * into j from private.totus_web_native_catalogue_jobs where id=p_job;
  if found then if j.website_key<>w.key or j.actor_id<>auth.uid() or j.shop_id<>p_shop then raise exception 'La solicitud corresponde a otra preparación.';end if;
  else insert into private.totus_web_native_catalogue_jobs(id,website_key,actor_id,connection_revision,shop_id) values(p_job,w.key,auth.uid(),c.revision,p_shop) returning * into j;end if;
 elsif p_action in ('pause','resume','cancel','context') then
  select * into strict j from private.totus_web_native_catalogue_jobs where id=p_job and website_key=w.key for update;
  if p_action in ('resume','context') and (w.status<>'active' or not c.enabled or c.verified_revision is distinct from c.revision or j.connection_revision<>c.revision) then raise exception 'La conexión ha cambiado. Inicia una preparación nueva.';end if;
  if p_action='pause' then update private.totus_web_native_catalogue_jobs set state='paused',updated_at=now() where id=j.id and state='running';
  elsif p_action='resume' then update private.totus_web_native_catalogue_jobs set state='running',updated_at=now() where id=j.id and state='paused';
  elsif p_action='cancel' then update private.totus_web_native_catalogue_jobs set state='cancelled',updated_at=now() where id=j.id and state in ('running','paused');
  elsif j.state<>'running' then raise exception 'La preparación no está en curso.';end if;
  select * into strict j from private.totus_web_native_catalogue_jobs where id=p_job;
 elsif p_action='status' then select * into j from private.totus_web_native_catalogue_jobs where website_key=w.key order by created_at desc limit 1;
 else raise exception 'Acción de catálogo no válida.';end if;
 if p_action in ('start','resume','context') and exists(select 1 from private.totus_web_import_jobs where website_key=w.key and state in ('running','paused')) then raise exception 'Termina o cancela la importación antes de preparar precios.';end if;
 if p_action='context' and j.phase in ('variants','remaining') then
  targets:=private.totus_web_catalogue_targets(w.key,j.phase,j.cursor_id,j.shop_id,j.id);
  select jsonb_build_object('countryId',nullif(a.data->>'id_country','')::bigint,'stateId',coalesce(nullif(a.data->>'id_state','')::bigint,0),'postcode',coalesce(a.data->>'postcode',''),'groupId',nullif(cu.data->>'id_default_group','')::bigint,'currencyId',(j.profile->>'currency_id')::bigint) into pricing from private.totus_web_source_records a join private.totus_web_source_records cu on cu.website_key=a.website_key and cu.resource='customers' and cu.source_id=(j.profile->>'counter_customer_id')::bigint where a.website_key=w.key and a.resource='addresses' and a.source_id=(j.profile->>'counter_address_id')::bigint;
 end if;
 if p_action<>'context' then select coalesce(jsonb_agg(jsonb_build_object('id',source_id,'name',data->>'name') order by source_id),'[]') into shops from private.totus_web_source_records where website_key=w.key and resource='shops';end if;
 return jsonb_build_object('website',w.key,'origin',w.origin,'connectionId',c.id,'connectionRevision',c.revision,'job',case when j.id is null then null else to_jsonb(j) end,'productId',nullif(targets#>>'{0,id}','')::bigint,'targets',targets,'pricing',pricing,'shops',shops);
end $$;
create or replace function public.totus_web_native_catalogue_commit(p_job uuid,p_actor uuid,p_phase text,p_page integer,p_cursor bigint,p_product bigint,p_data jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare j private.totus_web_native_catalogue_jobs;w private.totus_websites;c private.totus_api_connections;targets jsonb;item jsonb;target jsonb;n integer:=0;last_id bigint;
begin
 select * into strict j from private.totus_web_native_catalogue_jobs where id=p_job for update;
 select * into strict w from private.totus_websites where key=j.website_key;select * into strict c from private.totus_api_connections where id=w.connection_id;
 if j.actor_id is distinct from p_actor or j.state<>'running' or w.status<>'active' or not c.enabled or c.verified_revision is distinct from c.revision or j.connection_revision<>c.revision then raise exception 'La preparación ha cambiado.';end if;
 if j.phase is distinct from p_phase or j.page is distinct from p_page or j.cursor_id is distinct from p_cursor then return jsonb_build_object('retry',true);end if;
 if exists(select 1 from private.totus_web_import_jobs where website_key=w.key and state in ('running','paused')) then raise exception 'La importación ha cambiado. Se conserva el último lote confirmado.';end if;
 if j.phase='profile' then
  if p_data->>'verified' is distinct from 'true' or (p_data->>'shop_id')::bigint is distinct from j.shop_id or p_data->>'currency' is null or p_data->>'language_id' is null then raise exception 'El perfil nativo no coincide con la tienda.';end if;
  update private.totus_web_native_catalogue_jobs set profile=p_data,phase='variants',updated_at=now() where id=j.id;
 else
  if j.phase not in ('variants','remaining') then raise exception 'Inicia una preparación nueva para usar la lectura por lotes.';end if;
  targets:=private.totus_web_catalogue_targets(w.key,j.phase,j.cursor_id,j.shop_id,j.id);
  if nullif(targets#>>'{0,id}','')::bigint is distinct from p_product then return jsonb_build_object('retry',true);end if;
  if targets='[]' then update private.totus_web_native_catalogue_jobs set phase=case when phase='variants' then 'remaining' else 'completed' end,state=case when phase='remaining' then 'completed' else state end,cursor_id=0,updated_at=now() where id=j.id;
  else
   if jsonb_typeof(p_data->'items') is distinct from 'array' or jsonb_array_length(p_data->'items')<>jsonb_array_length(targets) or p_data->>'currency' is distinct from j.profile->>'currency' then raise exception 'El lote no contiene todos sus precios.';end if;
   if (select count(distinct (x->>'product_id')||':'||(x->>'attribute_id')) from jsonb_array_elements(p_data->'items') x)<>jsonb_array_length(targets) then raise exception 'El lote contiene identidades repetidas.';end if;
   for target in select value from jsonb_array_elements(targets) loop
    select value into item from jsonb_array_elements(p_data->'items') where value->>'product_id'=target->>'productId' and value->>'attribute_id'=target->>'attributeId';
    if item is null or coalesce((item->>'preview_cents')::bigint,-1)<0 or nullif(item->>'unit_tax_incl','') is null or nullif(item->>'unit_tax_excl','') is null then raise exception 'Un precio del lote no es válido.';end if;
    insert into private.totus_web_native_catalogue_items(website_key,shop_id,product_id,attribute_id,data,job_id) values(w.key,j.shop_id,(item->>'product_id')::bigint,(item->>'attribute_id')::bigint,item,j.id) on conflict(website_key,shop_id,product_id,attribute_id) do update set data=excluded.data,job_id=excluded.job_id,updated_at=now();
    last_id:=(target->>'id')::bigint;n:=n+1;
   end loop;
   update private.totus_web_native_catalogue_jobs set processed=processed+n,cursor_id=last_id,profile=profile||jsonb_build_object('pricing_context',p_data->'pricing_context'),updated_at=now() where id=j.id;
  end if;
 end if;
 return jsonb_build_object('ok',true,'processed',n);
end $$;
-- Preserve the existing public wrapper and explicit service-role-only commit grants.
revoke all on function public.totus_web_native_catalogue_commit(uuid,uuid,text,integer,bigint,bigint,jsonb) from public,anon,authenticated;
grant execute on function public.totus_web_native_catalogue_commit(uuid,uuid,text,integer,bigint,bigint,jsonb) to service_role;
commit;
