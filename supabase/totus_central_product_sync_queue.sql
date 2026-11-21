-- Native user saves and their outgoing intent commit in one transaction.
-- Importers keep using their own projection functions; importing never echoes
-- source changes into this user-intent queue.
begin;
create table if not exists private.totus_central_product_sync_queue(
 id uuid primary key default gen_random_uuid(),
 request_id uuid not null,actor_id uuid not null,
 store_id uuid not null references public.ops_stores(id) on delete cascade,
 product_id uuid not null references public.products(id) on delete cascade,
 website_key text not null references private.totus_websites(key) on delete cascade,
 before_snapshot jsonb,desired_snapshot jsonb not null,changes jsonb not null default '[]',destination jsonb,
 status text not null default 'pending' check(status in('pending','running','conflict','needs_configuration','uncertain','completed','cancelled')),
 external_request uuid not null default gen_random_uuid(),result jsonb,notice text,
 created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
 unique(request_id,website_key)
);
alter table private.totus_central_product_sync_queue add column if not exists destination jsonb;
create index if not exists central_product_sync_pending on private.totus_central_product_sync_queue(website_key,created_at,id) where status in('pending','running','uncertain');
alter table private.totus_central_product_sync_queue enable row level security;
revoke all on private.totus_central_product_sync_queue from public,anon,authenticated;

create or replace function private.totus_central_product_snapshot(p_store uuid,p_product uuid) returns jsonb
language sql stable security invoker set search_path='' as $$
 select to_jsonb(p)||jsonb_build_object('variants',coalesce((select jsonb_agg(to_jsonb(v) order by v.id) from public.product_variants v where v.product_id=p.id),'[]'),
 'catalogue',coalesce((select jsonb_agg(to_jsonb(c) order by c.id) from private.totus_tpv_local_catalogue c where c.store_id=p_store and c.product_id=p.id),'[]'))
 from public.products p where p.store_id=p_store and p.id=p_product
$$;
revoke all on function private.totus_central_product_snapshot(uuid,uuid) from public,anon,authenticated;

create or replace function public.totus_central_product_save(p_store uuid,p_id uuid,p_request uuid,p_data jsonb,p_changes jsonb default '[]') returns jsonb
language plpgsql security definer set search_path='' as $$
declare actor uuid:=auth.uid();old_snapshot jsonb;desired jsonb;result jsonb;had_prior boolean;destination record;count_queued integer:=0;destinations integer;
begin
 if actor is null or not exists(select 1 from public.profiles where id=actor and active)
 or private.totus_can('productos',case when p_id is null then 'create' else 'edit' end) is not true
 or private.totus_local_store_access(p_store) is not true then raise exception 'No tienes permiso para guardar este producto.';end if;
 if p_request is null or octet_length(p_changes::text)>1000000 then raise exception 'Solicitud de guardado no válida.';end if;
 if jsonb_typeof(p_changes)='array' then
  if jsonb_array_length(p_changes)>100 then raise exception 'Demasiados cambios.';end if;
 elsif jsonb_typeof(p_changes)='object' then
  if not(p_changes?&array['resource','recordId','changes']) or p_changes-array['resource','recordId','changes']<>'{}'::jsonb or p_changes->>'resource' not in('products','combinations') or jsonb_typeof(p_changes->'changes') is distinct from 'array' or jsonb_array_length(p_changes->'changes') not between 1 and 100 then raise exception 'Revisión de salida no válida.';end if;
  if p_changes->>'resource'='products' then
   if p_id is null or p_changes->>'recordId' is distinct from p_id::text then raise exception 'El producto de salida no coincide.';end if;
  elsif not exists(select 1 from public.product_variants where id::text=p_changes->>'recordId' and product_id=p_id) then raise exception 'La combinación de salida no pertenece al producto.';end if;
 else raise exception 'Solicitud de guardado no válida.';end if;
 perform 1 from public.ops_stores where id=p_store for key share;
 perform pg_advisory_xact_lock(hashtextextended('native-workspace:'||p_request::text,0));
 select exists(select 1 from private.totus_local_workspace_requests where id=p_request) into had_prior;
 if not had_prior and p_id is not null then
  perform 1 from public.products where id=p_id and store_id=p_store for update;
  old_snapshot:=private.totus_central_product_snapshot(p_store,p_id);
 end if;
 result:=public.totus_local_store_workspace(p_store,'products','save',p_id,p_request,p_data);
 if result->>'saved' is distinct from 'true' then return result;end if;
 if not had_prior then
  desired:=private.totus_central_product_snapshot(p_store,(result->>'id')::uuid);
  -- A native product with several possible channels needs an explicit target;
  -- saving the local product still succeeds. Existing source bindings are exact.
  select count(*) into destinations from private.totus_websites w where w.business_id=p_store and w.status<>'retired'
  and (desired->>'source_website' is null or w.key=desired->>'source_website');
  if destinations=1 then
   for destination in select w.key,w.origin,w.connection_id from private.totus_websites w where w.business_id=p_store and w.status<>'retired'
    and (desired->>'source_website' is null or w.key=desired->>'source_website') for key share loop
    insert into private.totus_central_product_sync_queue(request_id,actor_id,store_id,product_id,website_key,before_snapshot,desired_snapshot,changes,destination)
    values(p_request,actor,p_store,(result->>'id')::uuid,destination.key,old_snapshot,desired,p_changes,jsonb_build_object('origin',destination.origin,'connectionId',destination.connection_id))
    on conflict(request_id,website_key) do nothing;
   end loop;
  end if;
 end if;
 select count(*) into count_queued from private.totus_central_product_sync_queue where request_id=p_request and actor_id=actor;
 return result||jsonb_build_object('queued',count_queued,'synchronization',case when count_queued>0 then 'pending' when coalesce(destinations,0)>1 then 'choose_destination' else 'local' end);
end $$;
revoke all on function public.totus_central_product_save(uuid,uuid,uuid,jsonb,jsonb) from public,anon;
grant execute on function public.totus_central_product_save(uuid,uuid,uuid,jsonb,jsonb) to authenticated;

-- Reconciliation shares the save's request lock. Cancelling an absent intent
-- writes a tombstone, so a late request cannot arrive after a revised save.
create or replace function public.totus_central_product_save_receipt(p_store uuid,p_id uuid,p_request uuid,p_data jsonb default null,p_cancel_absent boolean default false) returns jsonb
language plpgsql security definer set search_path='' as $$
declare actor uuid:=auth.uid();prior private.totus_local_workspace_requests;intent jsonb;result jsonb;
begin
 if actor is null or not exists(select 1 from public.profiles where id=actor and active)
 or private.totus_can('productos',case when p_id is null then 'create' else 'edit' end) is not true
 or private.totus_local_store_access(p_store) is not true or p_request is null then raise exception 'No tienes acceso a esta solicitud de producto.';end if;
 if p_data is not null and (jsonb_typeof(p_data) is distinct from 'object' or octet_length(p_data::text)>2000000) then raise exception 'Solicitud de recuperación no válida.';end if;
 intent:=jsonb_build_object('store',p_store,'kind','products','action','save','id',p_id,'data',p_data);
 perform 1 from public.ops_stores where id=p_store for key share;
 perform pg_advisory_xact_lock(hashtextextended('native-workspace:'||p_request::text,0));
 select * into prior from private.totus_local_workspace_requests where id=p_request;
 if found then
  if prior.actor_id<>actor or prior.store_id<>p_store or prior.intent->>'kind'<>'products' or prior.intent->>'action'<>'save'
  or prior.intent->>'id' is distinct from p_id::text or (p_data is not null and prior.intent<>intent) then raise exception 'La solicitud pertenece a otra operación.';end if;
  return prior.result||jsonb_build_object('receipt',case when prior.result->>'saved'='true' then 'saved' else 'cancelled' end);
 end if;
 if not coalesce(p_cancel_absent,false) then return jsonb_build_object('receipt','absent','storeId',p_store,'id',p_id);end if;
 if p_data is null then raise exception 'Conserva los datos originales para cancelar una solicitud ausente.';end if;
 result:=jsonb_build_object('id',p_id,'storeId',p_store,'saved',false,'cancelled',true);
 insert into private.totus_local_workspace_requests(id,actor_id,store_id,intent,result) values(p_request,actor,p_store,intent,result);
 return result||jsonb_build_object('receipt','cancelled');
end $$;
revoke all on function public.totus_central_product_save_receipt(uuid,uuid,uuid,jsonb,boolean) from public,anon;
grant execute on function public.totus_central_product_save_receipt(uuid,uuid,uuid,jsonb,boolean) to authenticated;

create or replace function public.totus_central_product_sync_status(p_store uuid,p_product uuid default null) returns jsonb
language plpgsql stable security definer set search_path='' as $$
begin
 if auth.uid() is null or not exists(select 1 from public.profiles where id=auth.uid() and active)
 or private.totus_can('productos','view') is not true or private.totus_local_store_access(p_store) is not true
 then raise exception 'No tienes acceso a la sincronización de esta tienda.';end if;
 return jsonb_build_object('storeId',p_store,'items',coalesce((select jsonb_agg(jsonb_build_object('id',q.id,'productId',q.product_id,'website',q.website_key,'status',q.status,'notice',q.notice,'createdAt',q.created_at,'updatedAt',q.updated_at) order by q.created_at desc,q.id)
 from private.totus_central_product_sync_queue q where q.store_id=p_store and (p_product is null or q.product_id=p_product)),'[]'));
end $$;
revoke all on function public.totus_central_product_sync_status(uuid,uuid) from public,anon;
grant execute on function public.totus_central_product_sync_status(uuid,uuid) to authenticated;
commit;
