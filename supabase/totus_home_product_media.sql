-- Read saved media for the exact catalogue entries displayed in Inicio.
begin;
create or replace function public.totus_home_product_media(p_store uuid,p_ids uuid[]) returns jsonb
language plpgsql stable security definer set search_path='' as $$
declare result jsonb;
begin
 if auth.uid() is null or not exists(select 1 from public.profiles where id=auth.uid() and active)
 or private.totus_can('inicio','view') is not true or private.totus_local_store_access(p_store) is not true then raise exception 'No tienes acceso a esta tienda.';end if;
 if p_ids is null or cardinality(p_ids)>200 then raise exception 'Consulta de imágenes no válida.';end if;
 select coalesce(jsonb_agg(jsonb_build_object('id',c.id,'imageUrl',coalesce(
 nullif(c.metadata->>'imageUrl',''),nullif(p.details->>'imageUrl',''),
 case when p.details#>>'{sourceData,id_default_image}'~'^[1-9][0-9]{0,14}$' and w.origin like 'https://%'
 then rtrim(w.origin,'/')||'/'||(p.details#>>'{sourceData,id_default_image}')||'-home_default/product.jpg' end,''))), '[]') into result
 from private.totus_tpv_local_catalogue c join public.products p on p.id=c.product_id and p.store_id=p_store
 left join private.totus_websites w on w.key=p.source_website
 where c.store_id=p_store and c.id=any(p_ids);
 return jsonb_build_object('storeId',p_store,'items',result);
end $$;
revoke all on function public.totus_home_product_media(uuid,uuid[]) from public,anon;
grant execute on function public.totus_home_product_media(uuid,uuid[]) to authenticated;
commit;
