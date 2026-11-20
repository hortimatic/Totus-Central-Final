-- Generic durable source records. No connection, business record or fixture is seeded.
begin;
create table if not exists private.totus_web_import_jobs(
 id uuid primary key, website_key text not null references private.totus_websites(key),
 actor_id uuid not null references auth.users(id), connection_revision bigint not null,
 resources text[] not null, resource_index integer not null default 1,
 cursor_id bigint not null default 0, imported bigint not null default 0,
 state text not null default 'running' check(state in ('running','paused','completed','cancelled')),
 progress jsonb not null default '{}', created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create unique index if not exists totus_web_import_active on private.totus_web_import_jobs(website_key) where state in ('running','paused');
create table if not exists private.totus_web_source_records(
 website_key text not null references private.totus_websites(key), resource text not null,
 source_id bigint not null check(source_id>0), data jsonb not null,
 imported_at timestamptz not null default now(), job_id uuid not null references private.totus_web_import_jobs(id),
 primary key(website_key,resource,source_id)
);
alter table private.totus_web_import_jobs enable row level security;
alter table private.totus_web_source_records enable row level security;
revoke all on private.totus_web_import_jobs,private.totus_web_source_records from public,anon,authenticated;

create or replace function private.totus_web_import(p_website text,p_action text default 'status',p_job uuid default null,p_resources text[] default null) returns jsonb
language plpgsql security definer set search_path='' as $$
declare w private.totus_websites;c private.totus_api_connections;j private.totus_web_import_jobs;r text;permitted text[]:=array['languages','categories','manufacturers','suppliers','product_options','product_option_values','product_features','product_feature_values','tags','products','combinations','product_suppliers','specific_prices','specific_price_rules','image_types','shops','shop_groups','stores','stock_availables','warehouses','warehouse_product_locations','stocks','stock_movement_reasons','stock_movements','supply_order_states','supply_orders','supply_order_details','supply_order_histories','supply_order_receipt_histories','customers','groups','addresses','countries','states','currencies','taxes','tax_rule_groups','tax_rules','carriers','cart_rules','orders','order_details','order_histories','order_states','order_payments','order_invoices','order_slip','order_carriers','order_cart_rules','deliveries'];
begin
 if auth.uid() is null then raise exception 'Inicia sesión.';end if;
 perform private.totus_api_admin();
 select * into strict w from private.totus_websites where key=p_website;
 select * into strict c from private.totus_api_connections where id=w.connection_id;
 perform pg_advisory_xact_lock(hashtextextended('web-import:'||p_website,0));
 if p_action='start' then
  if w.status<>'active' or not c.enabled or c.verified_revision is distinct from c.revision or not c.real_data_authorized then raise exception 'Activa y verifica la conexión antes de importar.';end if;
  if p_job is null or cardinality(p_resources) is null or cardinality(p_resources)<1 or not p_resources <@ permitted or cardinality(p_resources)<>(select count(distinct x) from unnest(p_resources) x) then raise exception 'Selecciona los datos que quieres importar.';end if;
  select * into j from private.totus_web_import_jobs where id=p_job;
  if found then
   if j.website_key<>p_website or j.actor_id<>auth.uid() or j.resources<>p_resources then raise exception 'La solicitud corresponde a otra importación.';end if;
  else
   if exists(select 1 from private.totus_web_import_jobs where website_key=p_website and state in ('running','paused')) then raise exception 'Ya existe una importación pendiente. Reanúdala o cancélala.';end if;
   insert into private.totus_web_import_jobs(id,website_key,actor_id,connection_revision,resources) values(p_job,p_website,auth.uid(),c.revision,p_resources) returning * into j;
  end if;
 elsif p_action in ('pause','resume','cancel','step_context') then
  select * into strict j from private.totus_web_import_jobs where id=p_job and website_key=p_website for update;
  if p_action='resume' then
   if w.status<>'active' or not c.enabled or c.verified_revision is distinct from c.revision or j.connection_revision<>c.revision then raise exception 'La conexión ha cambiado. Cancela y comienza una nueva importación.';end if;
   update private.totus_web_import_jobs set state='running',updated_at=now() where id=j.id and state='paused' returning * into j;
  elsif p_action='pause' then update private.totus_web_import_jobs set state='paused',updated_at=now() where id=j.id and state='running' returning * into j;
  elsif p_action='cancel' then update private.totus_web_import_jobs set state='cancelled',updated_at=now() where id=j.id and state in ('running','paused') returning * into j;
  else
   if j.state<>'running' or w.status<>'active' or not c.enabled or c.verified_revision is distinct from c.revision or j.connection_revision<>c.revision then raise exception 'La importación no está activa o ha cambiado la conexión.';end if;
  end if;
  select * into strict j from private.totus_web_import_jobs where id=p_job and website_key=p_website;
 elsif p_action in ('status','progress') then
  select * into j from private.totus_web_import_jobs where website_key=p_website order by created_at desc limit 1;
 else raise exception 'Acción de importación no válida.';end if;
 return jsonb_build_object('website',w.key,'name',w.name,'origin',w.origin,'connectionId',c.id,'connectionRevision',c.revision,'job',case when j.id is null then null else to_jsonb(j) end,
 'counts',case when p_action in ('step_context','progress') then '{}'::jsonb else coalesce((select jsonb_object_agg(resource,n) from(select resource,count(*) n from private.totus_web_source_records where website_key=w.key group by resource) q),'{}') end);
end $$;
revoke all on function private.totus_web_import(text,text,uuid,text[]) from public,anon;
grant execute on function private.totus_web_import(text,text,uuid,text[]) to authenticated;
create or replace function public.totus_web_import(p_website text,p_action text default 'status',p_job uuid default null,p_resources text[] default null) returns jsonb language sql security invoker set search_path='' as $wrapper$ select private.totus_web_import(p_website,p_action,p_job,p_resources) $wrapper$;
revoke all on function public.totus_web_import(text,text,uuid,text[]) from public,anon;
grant execute on function public.totus_web_import(text,text,uuid,text[]) to authenticated;

create or replace function public.totus_web_import_commit(p_job uuid,p_actor uuid,p_resource text,p_cursor bigint,p_rows jsonb,p_more boolean) returns jsonb
language plpgsql security definer set search_path='' as $$
declare j private.totus_web_import_jobs;w private.totus_websites;c private.totus_api_connections;row_data jsonb;next_cursor bigint:=p_cursor;v_source_id bigint;n integer:=0;
begin
 select * into strict j from private.totus_web_import_jobs where id=p_job for update;
 select * into strict w from private.totus_websites where key=j.website_key;
 select * into strict c from private.totus_api_connections where id=w.connection_id;
 if j.actor_id<>p_actor or j.state<>'running' or w.status<>'active' or not c.enabled or c.verified_revision is distinct from c.revision or j.connection_revision<>c.revision then raise exception 'La importación o sus permisos han cambiado.';end if;
 if p_cursor<>j.cursor_id or p_resource is distinct from j.resources[j.resource_index] then return jsonb_build_object('retry',true);end if;
 if jsonb_typeof(p_rows) is distinct from 'array' or jsonb_array_length(p_rows)>1000 or p_more is null then raise exception 'Lote no válido.';end if;
 for row_data in select value from jsonb_array_elements(p_rows) loop
  if coalesce(row_data->>'id','') !~ '^[1-9][0-9]{0,14}$' then raise exception 'Registro sin identidad de origen.';end if;
  v_source_id:=(row_data->>'id')::bigint;
  if v_source_id<=next_cursor then raise exception 'Orden de origen no válido.';end if;
  next_cursor:=v_source_id;n:=n+1;
  insert into private.totus_web_source_records(website_key,resource,source_id,data,job_id) values(j.website_key,p_resource,v_source_id,row_data,p_job)
  on conflict(website_key,resource,source_id) do update set data=excluded.data,job_id=excluded.job_id,imported_at=now();
 end loop;
 if n=0 and p_more then raise exception 'La API no ha avanzado.';end if;
 update private.totus_web_import_jobs set cursor_id=case when p_more then next_cursor else 0 end,resource_index=resource_index+case when p_more then 0 else 1 end,
 imported=imported+n,progress=jsonb_set(progress,array[p_resource],to_jsonb(coalesce((progress->>p_resource)::bigint,0)+n)),
 state=case when not p_more and resource_index=cardinality(resources) then 'completed' else state end,updated_at=now() where id=p_job;
 return jsonb_build_object('stored',n,'retry',false);
end $$;
revoke all on function public.totus_web_import_commit(uuid,uuid,text,bigint,jsonb,boolean) from public,anon,authenticated;
grant execute on function public.totus_web_import_commit(uuid,uuid,text,bigint,jsonb,boolean) to service_role;
commit;
