-- Queue leases are acquired with the caller's normal Products/store permission.
-- Completion is server-only: a browser cannot declare an unverified web write.
begin;
create or replace function private.totus_central_product_snapshot(p_store uuid,p_product uuid) returns jsonb
language sql stable security invoker set search_path='' as $$
 select to_jsonb(p)||jsonb_build_object('variants',coalesce((select jsonb_agg(to_jsonb(v) order by v.id) from public.product_variants v where v.product_id=p.id),'[]'),
 'catalogue',coalesce((select jsonb_agg(to_jsonb(c) order by c.id) from private.totus_tpv_local_catalogue c where c.store_id=p_store and c.product_id=p.id),'[]'),
 'source_combinations',coalesce((select jsonb_object_agg(v.id::text,r.data) from public.product_variants v join private.totus_web_source_records r on r.website_key=v.source_website and r.resource='combinations' and r.source_id=v.source_id where v.product_id=p.id),'{}'))
 from public.products p where p.store_id=p_store and p.id=p_product
$$;
revoke all on function private.totus_central_product_snapshot(uuid,uuid) from public,anon,authenticated;
alter table private.totus_central_product_sync_queue add column if not exists lease_id uuid;
alter table private.totus_central_product_sync_queue add column if not exists lease_actor uuid;
alter table private.totus_central_product_sync_queue add column if not exists lease_until timestamptz;
create or replace function public.totus_central_product_sync_claim(p_store uuid) returns jsonb
language plpgsql security definer set search_path='' as $$
declare actor uuid:=auth.uid();chosen private.totus_central_product_sync_queue;token uuid:=gen_random_uuid();
begin
 if actor is null or not exists(select 1 from public.profiles where id=actor and active)
 or private.totus_can('productos','edit') is not true or private.totus_local_store_access(p_store) is not true
 then raise exception 'No tienes permiso para sincronizar esta tienda.';end if;
 select q.* into chosen from private.totus_central_product_sync_queue q
 join private.totus_websites w on w.key=q.website_key and w.business_id=q.store_id and w.status='active'
 where q.store_id=p_store and (q.status in('pending','uncertain') or q.status='running' and q.lease_until<clock_timestamp())
 and not exists(select 1 from private.totus_central_product_sync_queue earlier where earlier.website_key=q.website_key and earlier.product_id=q.product_id and earlier.status not in('completed','cancelled') and (earlier.created_at,earlier.id)<(q.created_at,q.id))
 order by q.created_at,q.id for update of q skip locked limit 1;
 if not found then return jsonb_build_object('storeId',p_store,'job',null);end if;
 update private.totus_central_product_sync_queue set status='running',lease_id=token,lease_actor=actor,lease_until=clock_timestamp()+interval '5 minutes',updated_at=clock_timestamp() where id=chosen.id returning * into chosen;
 return jsonb_build_object('storeId',p_store,'job',to_jsonb(chosen)||jsonb_build_object('source_combinations',coalesce(chosen.before_snapshot->'source_combinations','{}')));
end $$;
revoke all on function public.totus_central_product_sync_claim(uuid) from public,anon;
grant execute on function public.totus_central_product_sync_claim(uuid) to authenticated;

create or replace function public.totus_central_product_sync_finish(p_job uuid,p_lease uuid,p_actor uuid,p_status text,p_notice text,p_result jsonb default '{}') returns jsonb
language plpgsql security definer set search_path='' as $$
declare chosen private.totus_central_product_sync_queue;
begin
 if p_job is null or p_lease is null or p_actor is null or p_status not in('completed','conflict','needs_configuration','uncertain','pending') or length(coalesce(p_notice,''))>512 or jsonb_typeof(p_result) is distinct from 'object' or octet_length(p_result::text)>4096 then raise exception 'Resultado de sincronización no válido.';end if;
 select * into chosen from private.totus_central_product_sync_queue where id=p_job for update;
 if not found or chosen.status<>'running' or chosen.lease_id is distinct from p_lease or chosen.lease_actor is distinct from p_actor or chosen.lease_until<clock_timestamp() then raise exception 'El turno de sincronización ya no está activo.';end if;
 if p_status='completed' and p_result->>'verified' is distinct from 'true' then raise exception 'Falta la relectura de la web.';end if;
 update private.totus_central_product_sync_queue set status=p_status,notice=p_notice,result=p_result,lease_id=null,lease_actor=null,lease_until=null,updated_at=clock_timestamp() where id=p_job;
 return jsonb_build_object('id',p_job,'storeId',chosen.store_id,'productId',chosen.product_id,'status',p_status,'notice',p_notice);
end $$;
revoke all on function public.totus_central_product_sync_finish(uuid,uuid,uuid,text,text,jsonb) from public,anon,authenticated;
grant execute on function public.totus_central_product_sync_finish(uuid,uuid,uuid,text,text,jsonb) to service_role;
commit;
