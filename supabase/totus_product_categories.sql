-- Category snapshots are populated only by verified server reads. Local shop
-- categories use the same read contract without requiring a website.
create table if not exists private.totus_category_snapshots(
 store_id uuid primary key references public.ops_stores(id), website_key text,
 items jsonb not null default '[]', languages jsonb not null default '[]',
 revision bigint not null default 0, updated_at timestamptz not null default clock_timestamp()
);
create table if not exists private.totus_category_reads(
 id uuid primary key default gen_random_uuid(), actor_id uuid not null,
 store_id uuid not null references public.ops_stores(id), website_key text not null,
 connection_id uuid not null, connection_revision bigint not null,
 created_at timestamptz not null default clock_timestamp(), completed boolean not null default false
);
create table if not exists private.totus_category_edits(
 request_id uuid primary key, actor_id uuid not null, store_id uuid not null,
 signature text not null, record_id text not null, created_at timestamptz not null default clock_timestamp()
);
create sequence if not exists private.totus_local_category_id start 900000000000000 maxvalue 999999999999999;
alter table private.totus_category_snapshots enable row level security;
alter table private.totus_category_reads enable row level security;
alter table private.totus_category_edits enable row level security;
revoke all on private.totus_category_snapshots,private.totus_category_reads,private.totus_category_edits from public,anon,authenticated;

create or replace function public.totus_category_workspace(p_store uuid,p_sync boolean default false)
returns jsonb language plpgsql security definer set search_path='' as $$
declare w private.totus_websites%rowtype;c private.totus_api_connections%rowtype;
 s private.totus_category_snapshots%rowtype; rows jsonb; langs jsonb; token uuid;ready boolean;
begin
 if auth.uid() is null or private.totus_can('productos','view') is not true
 or private.totus_local_store_access(p_store) is not true then raise exception 'No tienes acceso a las categorías de esta tienda.';end if;
 if (select count(*) from private.totus_websites where business_id=p_store)>1 then raise exception 'La tienda tiene varios orígenes. Selecciona una única conexión de categorías.';end if;
 select * into w from private.totus_websites where business_id=p_store;
 select * into c from private.totus_api_connections where id=w.connection_id;
 ready:=coalesce(w.status='active' and c.enabled and c.real_data_authorized and c.verified_revision=c.revision,false);
 select * into s from private.totus_category_snapshots where store_id=p_store;
 if found and (s.website_key is not distinct from w.key or w.key is null) then rows:=s.items;langs:=s.languages;
 else
  select coalesce(jsonb_agg(data||jsonb_build_object('id',source_id::text) order by source_id),'[]') into rows from private.totus_web_source_records where website_key=w.key and resource='categories';
  select coalesce(jsonb_agg(data||jsonb_build_object('id',source_id::text)),'[]') into langs from private.totus_web_source_records where website_key=w.key and resource='languages';
 end if;
 if p_sync then
  if not ready then raise exception 'Conecta y verifica la web de esta tienda antes de sincronizar.';end if;
  insert into private.totus_category_reads(actor_id,store_id,website_key,connection_id,connection_revision) values(auth.uid(),p_store,w.key,c.id,c.revision) returning id into token;
 end if;
 return jsonb_build_object('storeId',p_store,'items',rows,'languages',langs,'revision',coalesce(s.revision,0),'checkedAt',s.updated_at,
 'website',w.key,'connected',ready,'connectionId',c.id,'connectionRevision',c.revision,'token',token);
end $$;
revoke all on function public.totus_category_workspace(uuid,boolean) from public,anon;
grant execute on function public.totus_category_workspace(uuid,boolean) to authenticated;

create or replace function public.totus_category_snapshot_finish(p_token uuid,p_items jsonb,p_languages jsonb)
returns jsonb language plpgsql security definer set search_path='' as $$
declare t private.totus_category_reads%rowtype;result jsonb;actor_email text;
begin
 select * into t from private.totus_category_reads where id=p_token for update;
 if not found or t.completed or t.created_at<clock_timestamp()-interval '10 minutes' then raise exception 'La lectura ha caducado. Sincroniza de nuevo.';end if;
 select email into actor_email from auth.users where id=t.actor_id;
 if not exists(select 1 from public.profiles where id=t.actor_id and active)
 or private.totus_module_can(actor_email,'productos','view') is not true
 or not exists(select 1 from public.ops_stores where id=t.store_id and active)
 or not exists(select 1 from public.profiles p where p.id=t.actor_id and (p.role='admin' or exists(
 select 1 from public.ops_cash_drawers d join private.totus_tpv_general_templates g on g.drawer_id=d.id
 cross join lateral jsonb_array_elements(coalesce(g.cash_setup->'operators','[]')) o where d.store_id=t.store_id and d.active and o->>'actorId'=p.id::text
 and (o->>'sell'='true' or o->>'open'='true' or o->>'reconcile'='true'))))
 or not exists(select 1 from private.totus_websites w join private.totus_api_connections c on c.id=w.connection_id
 where w.key=t.website_key and w.business_id=t.store_id and w.status='active' and c.id=t.connection_id
 and c.revision=t.connection_revision and c.verified_revision=c.revision and c.enabled and c.real_data_authorized)
 then raise exception 'La cuenta, tienda o conexión ha cambiado. No se ha sustituido el catálogo.';end if;
 if jsonb_typeof(p_items) is distinct from 'array' or jsonb_array_length(p_items)>10000
 or jsonb_typeof(p_languages) is distinct from 'array' or jsonb_array_length(p_languages)>100
 or exists(select 1 from jsonb_array_elements(p_items) r where coalesce(r->>'id','')!~'^[1-9][0-9]{0,14}$' or coalesce(r->>'id_parent','')!~'^(0|[1-9][0-9]{0,14})$')
 or (select count(*)<>count(distinct r->>'id') from jsonb_array_elements(p_items) r) then raise exception 'La lectura de categorías es incompleta o inválida.';end if;
 perform pg_advisory_xact_lock(hashtextextended(t.store_id::text,0));
 if exists(select 1 from private.totus_category_snapshots where store_id=t.store_id and updated_at>t.created_at) then raise exception 'Existe una lectura más reciente. Actualiza las categorías.';end if;
 insert into private.totus_category_snapshots(store_id,website_key,items,languages,revision)
 values(t.store_id,t.website_key,p_items,p_languages,1) on conflict(store_id) do update set
 website_key=excluded.website_key,items=excluded.items,languages=excluded.languages,revision=private.totus_category_snapshots.revision+1,updated_at=clock_timestamp();
 update private.totus_category_reads set completed=true where id=p_token;
 return jsonb_build_object('ok',true,'storeId',t.store_id,'count',jsonb_array_length(p_items),'verified',true);
end $$;
revoke all on function public.totus_category_snapshot_finish(uuid,jsonb,jsonb) from public,anon,authenticated;
grant execute on function public.totus_category_snapshot_finish(uuid,jsonb,jsonb) to service_role;

create or replace function public.totus_category_local_save(p_store uuid,p_request uuid,p_id text,p_revision bigint,p_fields jsonb)
returns jsonb language plpgsql security definer set search_path='' as $$
declare s private.totus_category_snapshots%rowtype;prior private.totus_category_edits%rowtype;
 record jsonb;parent text:=p_fields->>'id_parent';current_parent text; rid text; signature text:=md5(coalesce(p_id,'')||p_fields::text);visited text[]:='{}';
begin
 if auth.uid() is null or private.totus_can('productos',case when p_id is null then 'create' else 'edit' end) is not true
 or private.totus_local_store_access(p_store) is not true then raise exception 'No tienes permiso para guardar categorías en esta tienda.';end if;
 if exists(select 1 from private.totus_websites where business_id=p_store and status='active') then raise exception 'Publica las categorías a través de la conexión verificada de esta tienda.';end if;
 if p_request is null or jsonb_typeof(p_fields) is distinct from 'object' or exists(select 1 from jsonb_each(p_fields) e where jsonb_typeof(e.value)<>'string') or exists(select 1 from jsonb_object_keys(p_fields) k where k not in ('name','id_parent','active','link_rewrite','description','meta_title','meta_description'))
 or coalesce(length(btrim(p_fields->>'name')),0) not between 1 and 128 or p_fields->>'name' ~ '[<>;=#{}]'
 or coalesce(p_fields->>'active','') not in ('0','1') or coalesce(p_fields->>'link_rewrite','')!~'^[[:alnum:]_-]{1,128}$'
 or length(coalesce(p_fields->>'meta_title',''))>255 or length(coalesce(p_fields->>'meta_description',''))>512
 or length(coalesce(p_fields->>'description',''))>100000 or coalesce(parent,'')!~'^(0|[1-9][0-9]{0,14})$'
 then raise exception 'Revisa los campos de la categoría.';end if;
 perform pg_advisory_xact_lock(hashtextextended(p_store::text,0));
 select * into prior from private.totus_category_edits where request_id=p_request;
 if found then
  if prior.actor_id<>auth.uid() or prior.store_id<>p_store or prior.signature<>signature then raise exception 'La solicitud pertenece a otro cambio.';end if;
  return jsonb_build_object('ok',true,'storeId',p_store,'record_id',prior.record_id,'verified',true,'replayed',true);
 end if;
 insert into private.totus_category_snapshots(store_id) values(p_store) on conflict do nothing;
 select * into s from private.totus_category_snapshots where store_id=p_store for update;
 if s.revision<>p_revision then raise exception 'Las categorías han cambiado. Actualiza antes de guardar.';end if;
 if p_id is not null then
  select r into record from jsonb_array_elements(s.items) r where r->>'id'=p_id;
  if not found then raise exception 'La categoría ya no está disponible.';end if;
 end if;
 if parent<>'0' and not exists(select 1 from jsonb_array_elements(s.items) r where r->>'id'=parent) then raise exception 'Selecciona una categoría padre de esta tienda.';end if;
 current_parent:=parent;
 while current_parent<>'0' loop
  if current_parent=p_id or current_parent=any(visited) or cardinality(visited)>=100 then raise exception 'No puedes situar una categoría dentro de sus subcategorías o superar cien niveles.';end if;
  visited:=array_append(visited,current_parent);
  select r->>'id_parent' into current_parent from jsonb_array_elements(s.items) r where r->>'id'=current_parent;
  if current_parent is null then raise exception 'La jerarquía está incompleta.';end if;
 end loop;
 rid:=coalesce(p_id,nextval('private.totus_local_category_id')::text);
 record:=coalesce(record,'{}')||p_fields||jsonb_build_object('id',rid,'date_upd',clock_timestamp()::text);
 if p_id is null then record:=record||jsonb_build_object('date_add',clock_timestamp()::text);end if;
 update private.totus_category_snapshots set items=(select coalesce(jsonb_agg(r),'[]') from jsonb_array_elements(s.items)r where r->>'id'<>rid)||jsonb_build_array(record),revision=revision+1,updated_at=clock_timestamp() where store_id=p_store;
 insert into private.totus_category_edits(request_id,actor_id,store_id,signature,record_id) values(p_request,auth.uid(),p_store,signature,rid);
 return jsonb_build_object('ok',true,'storeId',p_store,'record_id',rid,'verified',true);
end $$;
revoke all on function public.totus_category_local_save(uuid,uuid,text,bigint,jsonb) from public,anon;
grant execute on function public.totus_category_local_save(uuid,uuid,text,bigint,jsonb) to authenticated;

-- Preserve all existing directory permissions; categories belong to Products.
create or replace function public.totus_directory_context(p_kind text,p_action text default 'view')
returns jsonb language plpgsql security definer set search_path='' as $$
declare m text;
begin
 m:=case p_kind when 'clientes' then 'facturacion' when 'proveedores' then 'gastos' when 'marcas' then 'pricing' when 'atributos' then 'productos' when 'categorias' then 'productos' end;
 if auth.uid() is null or m is null or p_action is null or p_action not in ('view','create','edit','delete','export') or private.totus_can(m,p_action) is not true then raise exception 'No tienes permiso para esta operación del directorio.';end if;
 return private.totus_website_context();
end $$;
revoke all on function public.totus_directory_context(text,text) from public,anon;
grant execute on function public.totus_directory_context(text,text) to authenticated;

create or replace function public.totus_category_web_context(p_website text,p_action text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare shop uuid;
begin
 select business_id into shop from private.totus_websites where key=p_website and status='active';
 if shop is null or auth.uid() is null or p_action is null or p_action not in ('view','create','edit')
 or private.totus_can('productos',p_action) is not true or private.totus_local_store_access(shop) is not true then raise exception 'No tienes acceso a las categorías de esta web.';end if;
 return private.totus_website_context();
end $$;
revoke all on function public.totus_category_web_context(text,text) from public,anon;
grant execute on function public.totus_category_web_context(text,text) to authenticated;

-- Every product/category selector reads the latest verified snapshot. Other
-- auxiliary resources retain their existing paginated source contract.
create or replace function public.totus_central_product_resources(p_store uuid,p_resource text,p_after bigint default 0,p_limit integer default 100,p_website text default null)
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare source text;sources integer;items jsonb;next_id bigint;version bigint;s private.totus_category_snapshots%rowtype;
begin
 if auth.uid() is null or not exists(select 1 from public.profiles where id=auth.uid() and active)
 or private.totus_can('productos','view') is not true or private.totus_local_store_access(p_store) is not true then raise exception 'No tienes acceso al catálogo de esta tienda.';end if;
 if p_resource is null or p_resource<>all(array['languages','categories','combinations','product_options','product_option_values','product_features','product_feature_values','tags','tax_rule_groups','tax_rules','taxes','countries'])
 or p_after is null or p_after<0 or p_limit is null or p_limit not between 1 and 100 then raise exception 'Consulta auxiliar de productos no válida.';end if;
 select count(*),min(w.key) into sources,source from private.totus_websites w where w.business_id=p_store and (p_website is null or w.key=p_website);
 if p_website is not null and sources=0 then raise exception 'El origen no pertenece a esta tienda.';end if;
 if sources>1 then raise exception 'Selecciona el origen de los datos de esta tienda.';end if;
 select * into s from private.totus_category_snapshots where store_id=p_store;
 if found and p_resource='categories' and (s.website_key is not distinct from source or source is null) and (p_website is null or s.website_key=p_website) then
  select coalesce(jsonb_agg(r order by (r->>'id')::bigint),'[]'),max((r->>'id')::bigint) into items,next_id
  from (select r from jsonb_array_elements(s.items)r where (r->>'id')::bigint>p_after order by (r->>'id')::bigint limit p_limit) q;
  return jsonb_build_object('storeId',p_store,'resource',p_resource,'website',s.website_key,'revision',s.revision,'items',items,
  'nextCursor',case when exists(select 1 from jsonb_array_elements(s.items)r where (r->>'id')::bigint>next_id) then next_id else null end);
 end if;
 select coalesce(c.revision,0) into version from private.totus_web_source_counters c where c.website_key=source and c.resource=p_resource;
 select coalesce(jsonb_agg(r.data||jsonb_build_object('id',r.source_id::text) order by r.source_id),'[]'),max(r.source_id)
 into items,next_id from (select data,source_id from private.totus_web_source_records where website_key=source and resource=p_resource and source_id>p_after order by source_id limit p_limit)r;
 return jsonb_build_object('storeId',p_store,'resource',p_resource,'website',source,'revision',coalesce(version,0),'items',items,
 'nextCursor',case when next_id is not null and exists(select 1 from private.totus_web_source_records where website_key=source and resource=p_resource and source_id>next_id) then next_id else null end);
end $$;
revoke all on function public.totus_central_product_resources(uuid,text,bigint,integer,text) from public,anon;
grant execute on function public.totus_central_product_resources(uuid,text,bigint,integer,text) to authenticated;
