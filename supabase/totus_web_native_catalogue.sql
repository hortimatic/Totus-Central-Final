-- Durable, user-started native price catalogue. Installation does not import data.
begin;
create table if not exists private.totus_web_native_catalogue_jobs(
 id uuid primary key,website_key text not null references private.totus_websites(key),actor_id uuid not null references auth.users(id),
 connection_revision bigint not null,shop_id bigint not null check(shop_id>0),
 state text not null default 'running' check(state in ('running','paused','completed','cancelled')),
 phase text not null default 'profile' check(phase in ('profile','products','variants','remaining','completed')),
 page integer not null default 0,cursor_id bigint not null default 0,profile jsonb,
 processed bigint not null default 0,created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create unique index if not exists totus_web_native_catalogue_active on private.totus_web_native_catalogue_jobs(website_key) where state in ('running','paused');
create table if not exists private.totus_web_native_catalogue_items(
 website_key text not null references private.totus_websites(key),shop_id bigint not null,product_id bigint not null,attribute_id bigint not null,
 data jsonb not null,job_id uuid not null references private.totus_web_native_catalogue_jobs(id),updated_at timestamptz not null default now(),
 primary key(website_key,shop_id,product_id,attribute_id)
);
alter table private.totus_web_native_catalogue_jobs enable row level security;
alter table private.totus_web_native_catalogue_items enable row level security;
revoke all on private.totus_web_native_catalogue_jobs,private.totus_web_native_catalogue_items from public,anon,authenticated;
alter table private.totus_web_native_catalogue_jobs drop constraint if exists totus_web_native_catalogue_jobs_phase_check;
alter table private.totus_web_native_catalogue_jobs add constraint totus_web_native_catalogue_jobs_phase_check check(phase in ('profile','products','variants','remaining','completed'));
create or replace function private.totus_web_next_catalogue_product(p_web text,p_phase text,p_cursor bigint,p_shop bigint) returns bigint language sql stable security invoker set search_path='' as $$
 select min(p.source_id) from private.totus_web_source_records p where p.website_key=p_web and p.resource='products' and p.source_id>p_cursor and
 case when p_phase='variants' then exists(select 1 from private.totus_web_source_records v where v.website_key=p_web and v.resource='combinations' and v.data->>'id_product'=p.source_id::text)
 when p_phase='remaining' then not exists(select 1 from private.totus_web_native_catalogue_items i where i.website_key=p_web and i.shop_id=p_shop and i.product_id=p.source_id) else false end
$$;
revoke all on function private.totus_web_next_catalogue_product(text,text,bigint,bigint) from public,anon,authenticated;

create or replace function private.totus_web_native_catalogue(p_website text,p_action text default 'status',p_job uuid default null,p_shop bigint default null) returns jsonb
language plpgsql security definer set search_path='' as $$
declare w private.totus_websites;c private.totus_api_connections;j private.totus_web_native_catalogue_jobs;next_product bigint;shops jsonb;pricing jsonb;variants jsonb;parent jsonb;
begin
 if auth.uid() is null then raise exception 'Inicia sesión.';end if;perform private.totus_api_admin();
 select * into strict w from private.totus_websites where key=p_website;
 select * into strict c from private.totus_api_connections where id=w.connection_id;
 if w.business_id is null or private.totus_local_store_access(w.business_id) is not true then raise exception 'Asigna un establecimiento accesible.';end if;
 perform pg_advisory_xact_lock(hashtextextended('web-native-catalogue:'||w.key,0));
 if p_action='start' then
  if w.status<>'active' or not c.enabled or c.verified_revision is distinct from c.revision or not c.real_data_authorized then raise exception 'Verifica y activa la conexión.';end if;
  if p_job is null or p_shop is null or not exists(select 1 from private.totus_web_source_records where website_key=w.key and resource='shops' and source_id=p_shop) then raise exception 'Selecciona la tienda de la web importada.';end if;
  if exists(select 1 from private.totus_web_import_jobs where website_key=w.key and state in ('running','paused')) then raise exception 'Termina la importación antes de preparar precios.';end if;
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
 if j.phase in ('variants','remaining') then next_product:=private.totus_web_next_catalogue_product(w.key,j.phase,j.cursor_id,j.shop_id);end if;
 if p_action='context' and j.phase in ('variants','remaining') and next_product is not null then
  select data into parent from private.totus_web_source_records where website_key=w.key and resource='products' and source_id=next_product;
  parent:=parent||jsonb_build_object('_stock',coalesce((select nullif(s.data->>'quantity','')::numeric from private.totus_web_source_records s where s.website_key=w.key and s.resource='stock_availables' and s.data->>'id_product'=next_product::text and s.data->>'id_product_attribute'='0' order by (s.data->>'id_shop'=j.shop_id::text) desc,s.source_id limit 1),0));
  select jsonb_build_object('countryId',nullif(a.data->>'id_country','')::bigint,'stateId',coalesce(nullif(a.data->>'id_state','')::bigint,0),'postcode',coalesce(a.data->>'postcode',''),'groupId',nullif(cu.data->>'id_default_group','')::bigint,'currencyId',(j.profile->>'currency_id')::bigint) into pricing
   from private.totus_web_source_records a join private.totus_web_source_records cu on cu.website_key=a.website_key and cu.resource='customers' and cu.source_id=(j.profile->>'counter_customer_id')::bigint
   where a.website_key=w.key and a.resource='addresses' and a.source_id=(j.profile->>'counter_address_id')::bigint;
  select coalesce(jsonb_agg(jsonb_build_object('id',v.source_id,'data',v.data,'stock',coalesce((select (s.data->>'quantity')::numeric from private.totus_web_source_records s where s.website_key=w.key and s.resource='stock_availables' and s.data->>'id_product'=next_product::text and s.data->>'id_product_attribute'=v.source_id::text order by (s.data->>'id_shop'=j.shop_id::text) desc,s.source_id limit 1),0)) order by v.source_id),'[]') into variants from private.totus_web_source_records v where v.website_key=w.key and v.resource='combinations' and v.data->>'id_product'=next_product::text;
 end if;
 if p_action<>'context' then select coalesce(jsonb_agg(jsonb_build_object('id',source_id,'name',data->>'name') order by source_id),'[]') into shops from private.totus_web_source_records where website_key=w.key and resource='shops';end if;
 return jsonb_build_object('website',w.key,'origin',w.origin,'connectionId',c.id,'connectionRevision',c.revision,'job',case when j.id is null then null else to_jsonb(j) end,'productId',next_product,'shops',shops,'pricing',pricing,'product',parent,'variants',variants);
end $$;
revoke all on function private.totus_web_native_catalogue(text,text,uuid,bigint) from public,anon;
grant execute on function private.totus_web_native_catalogue(text,text,uuid,bigint) to authenticated;
create or replace function public.totus_web_native_catalogue(p_website text,p_action text default 'status',p_job uuid default null,p_shop bigint default null) returns jsonb language sql security invoker set search_path='' as $$select private.totus_web_native_catalogue(p_website,p_action,p_job,p_shop)$$;
revoke all on function public.totus_web_native_catalogue(text,text,uuid,bigint) from public,anon;
grant execute on function public.totus_web_native_catalogue(text,text,uuid,bigint) to authenticated;

create or replace function public.totus_web_native_catalogue_commit(p_job uuid,p_actor uuid,p_phase text,p_page integer,p_cursor bigint,p_product bigint,p_data jsonb) returns jsonb
language plpgsql security definer set search_path='' as $$
declare j private.totus_web_native_catalogue_jobs;w private.totus_websites;c private.totus_api_connections;item jsonb;next_product bigint;n integer:=0;
begin
 select * into strict j from private.totus_web_native_catalogue_jobs where id=p_job for update;
 select * into strict w from private.totus_websites where key=j.website_key;
 select * into strict c from private.totus_api_connections where id=w.connection_id;
 if j.actor_id is distinct from p_actor or j.state<>'running' or w.status<>'active' or not c.enabled or c.verified_revision is distinct from c.revision or j.connection_revision<>c.revision then raise exception 'La preparación ha cambiado.';end if;
 if j.phase is distinct from p_phase or j.page is distinct from p_page or j.cursor_id is distinct from p_cursor then return jsonb_build_object('retry',true);end if;
 if j.phase='profile' then
  if p_data->>'verified' is distinct from 'true' or (p_data->>'shop_id')::bigint is distinct from j.shop_id or p_data->>'currency' is null or p_data->>'language_id' is null then raise exception 'El perfil nativo no coincide con la tienda.';end if;
  update private.totus_web_native_catalogue_jobs set profile=p_data,phase='products',updated_at=now() where id=j.id;
 else
  if j.phase in ('variants','remaining') then
   next_product:=private.totus_web_next_catalogue_product(w.key,j.phase,j.cursor_id,j.shop_id);
   if next_product is distinct from p_product then raise exception 'La combinación no corresponde al recorrido actual.';end if;
  end if;
  if j.phase in ('variants','remaining') and next_product is null then update private.totus_web_native_catalogue_jobs set phase=case when phase='variants' then 'remaining' else 'completed' end,state=case when phase='remaining' then 'completed' else state end,cursor_id=0,page=0,updated_at=now() where id=j.id;
  else
   if jsonb_typeof(p_data->'items') is distinct from 'array' or jsonb_array_length(p_data->'items')>50 or jsonb_typeof(p_data->'has_more') is distinct from 'boolean' or p_data->>'currency'<>j.profile->>'currency' then raise exception 'La página nativa no es válida.';end if;
   for item in select value from jsonb_array_elements(p_data->'items') loop
    if coalesce((item->>'product_id')::bigint,0)<1 or coalesce((item->>'attribute_id')::bigint,-1)<0 or (j.phase in ('variants','remaining') and (item->>'product_id')::bigint<>p_product) or coalesce((item->>'preview_cents')::bigint,-1)<0 or nullif(item->>'unit_tax_incl','') is null or nullif(item->>'unit_tax_excl','') is null then raise exception 'Un precio nativo no es válido.';end if;
    insert into private.totus_web_native_catalogue_items(website_key,shop_id,product_id,attribute_id,data,job_id) values(w.key,j.shop_id,(item->>'product_id')::bigint,(item->>'attribute_id')::bigint,item,j.id)
     on conflict(website_key,shop_id,product_id,attribute_id) do update set data=excluded.data,job_id=excluded.job_id,updated_at=now();n:=n+1;
   end loop;
   if (p_data->>'has_more')::boolean and n=0 then raise exception 'La página vacía no permite avanzar.';end if;
   update private.totus_web_native_catalogue_jobs set processed=processed+n,updated_at=now(),profile=case when p_data?'pricing_context' then profile||jsonb_build_object('pricing_context',p_data->'pricing_context') else profile end,
    phase=case when phase='products' and not (p_data->>'has_more')::boolean then 'variants' else phase end,
    page=case when (p_data->>'has_more')::boolean then page+1 else 0 end,
    cursor_id=case when phase in ('variants','remaining') and not (p_data->>'has_more')::boolean then p_product else cursor_id end where id=j.id;
  end if;
 end if;
 return jsonb_build_object('ok',true,'processed',n);
end $$;
revoke all on function public.totus_web_native_catalogue_commit(uuid,uuid,text,integer,bigint,bigint,jsonb) from public,anon,authenticated;
grant execute on function public.totus_web_native_catalogue_commit(uuid,uuid,text,integer,bigint,bigint,jsonb) to service_role;
commit;
