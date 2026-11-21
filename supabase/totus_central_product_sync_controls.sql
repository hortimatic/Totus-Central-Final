-- User controls preserve the saved product and the original remote journal.
begin;
create or replace function public.totus_central_product_sync_control(p_store uuid,p_job uuid,p_action text,p_expected_updated timestamptz) returns jsonb
language plpgsql security definer set search_path='' as $$
declare actor uuid:=auth.uid();chosen private.totus_central_product_sync_queue;
begin
 if actor is null or not exists(select 1 from public.profiles where id=actor and active)
 or private.totus_can('productos','edit') is not true or private.totus_local_store_access(p_store) is not true then raise exception 'No tienes permiso para gestionar estos envíos.';end if;
 if p_action is null or p_action not in('cancel','retry') or p_expected_updated is null then raise exception 'Revisa la acción y su estado actual.';end if;
 select * into chosen from private.totus_central_product_sync_queue where id=p_job and store_id=p_store for update;
 if not found or chosen.updated_at is distinct from p_expected_updated then raise exception 'El envío ha cambiado. Actualiza el historial antes de continuar.';end if;
 if p_action='cancel' and chosen.status not in('conflict','needs_configuration') then raise exception 'Este envío no puede retirarse: primero hay que comprobar si la web lo recibió.';end if;
 if p_action='retry' and chosen.status<>'needs_configuration' then raise exception 'Revisa el conflicto antes de volver a enviar.';end if;
 update private.totus_central_product_sync_queue set status=case when p_action='cancel' then 'cancelled' else 'pending' end,
 notice=case when p_action='cancel' then 'Envío retirado por el usuario. El producto guardado en Central se conserva.' else 'Reintento solicitado por el usuario; pendiente de comprobación.' end,
 result=coalesce(result,'{}')||jsonb_build_object('userControl',p_action,'controlledBy',actor,'controlledAt',clock_timestamp()),updated_at=clock_timestamp()
 where id=p_job returning * into chosen;
 return jsonb_build_object('storeId',p_store,'id',p_job,'productId',chosen.product_id,'status',chosen.status,'notice',chosen.notice,'updatedAt',chosen.updated_at);
end $$;
revoke all on function public.totus_central_product_sync_control(uuid,uuid,text,timestamptz) from public,anon;
grant execute on function public.totus_central_product_sync_control(uuid,uuid,text,timestamptz) to authenticated;
commit;
