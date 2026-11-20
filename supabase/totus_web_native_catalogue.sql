-- Durable, user-started native price catalogue. Installation does not import data.
begin;
create table if not exists private.totus_web_native_catalogue_jobs(
 id uuid primary key,website_key text not null references private.totus_websites(key),actor_id uuid not null references auth.users(id),
 connection_revision bigint not null,shop_id bigint not null check(shop_id>0),
 state text not null default 'running' check(state in ('running','paused','completed','cancelled')),
 phase text not null default 'profile' check(phase in ('profile','products','variants','completed')),
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

create or replace function private.totus_web_native_catalogue(p_website text,p_action text default 'status',p_job uuid default null,p_shop bigint default null) returns jsonb
language plpgsql security definer set search_path='' as $$
declare w private.totus_websites;c private.totus_api_connections;j private.totus_web_native_catalogue_jobs;next_product bigint;shops jsonb;
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
 if j.phase='variants' then select min((data->>'id_product')::bigint) into next_product from private.totus_web_source_records where website_key=w.key and resource='combinations' and (data->>'id_product')::bigint>j.cursor_id;end if;
 if p_action<>'context' then select coalesce(jsonb_agg(jsonb_build_object('id',source_id,'name',data->>'name') order by source_id),'[]') into shops from private.totus_web_source_records where website_key=w.key and resource='shops';end if;
 return jsonb_build_object('website',w.key,'origin',w.origin,'connectionId',c.id,'connectionRevision',c.revision,'job',case when j.id is null then null else to_jsonb(j) end,'productId',next_product,'shops',shops);
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
  if j.phase='variants' then
   select min((data->>'id_product')::bigint) into next_product from private.totus_web_source_records where website_key=w.key and resource='combinations' and (data->>'id_product')::bigint>j.cursor_id;
   if next_product is distinct from p_product then raise exception 'La combinación no corresponde al recorrido actual.';end if;
  end if;
  if j.phase='variants' and next_product is null then update private.totus_web_native_catalogue_jobs set phase='completed',state='completed',updated_at=now() where id=j.id;
  else
   if jsonb_typeof(p_data->'items') is distinct from 'array' or jsonb_array_length(p_data->'items')>50 or jsonb_typeof(p_data->'has_more') is distinct from 'boolean' or p_data->>'currency'<>j.profile->>'currency' then raise exception 'La página nativa no es válida.';end if;
   for item in select value from jsonb_array_elements(p_data->'items') loop
    if coalesce((item->>'product_id')::bigint,0)<1 or coalesce((item->>'attribute_id')::bigint,-1)<0 or (j.phase='variants' and (item->>'product_id')::bigint<>p_product) or coalesce((item->>'preview_cents')::bigint,-1)<0 or nullif(item->>'unit_tax_incl','') is null or nullif(item->>'unit_tax_excl','') is null then raise exception 'Un precio nativo no es válido.';end if;
    insert into private.totus_web_native_catalogue_items(website_key,shop_id,product_id,attribute_id,data,job_id) values(w.key,j.shop_id,(item->>'product_id')::bigint,(item->>'attribute_id')::bigint,item,j.id)
     on conflict(website_key,shop_id,product_id,attribute_id) do update set data=excluded.data,job_id=excluded.job_id,updated_at=now();n:=n+1;
   end loop;
   if (p_data->>'has_more')::boolean and n=0 then raise exception 'La página vacía no permite avanzar.';end if;
   update private.totus_web_native_catalogue_jobs set processed=processed+n,updated_at=now(),
    phase=case when phase='products' and not (p_data->>'has_more')::boolean then 'variants' else phase end,
    page=case when (p_data->>'has_more')::boolean then page+1 else 0 end,
    cursor_id=case when phase='variants' and not (p_data->>'has_more')::boolean then p_product else cursor_id end where id=j.id;
  end if;
 end if;
 return jsonb_build_object('ok',true,'processed',n);
end $$;
revoke all on function public.totus_web_native_catalogue_commit(uuid,uuid,text,integer,bigint,bigint,jsonb) from public,anon,authenticated;
grant execute on function public.totus_web_native_catalogue_commit(uuid,uuid,text,integer,bigint,bigint,jsonb) to service_role;
commit;
