-- Read saved product organisation through its business, without API credentials.
-- Does not import, seed or modify business records.
begin;
create or replace function public.totus_central_product_resources(
 p_store uuid,p_resource text,p_after bigint default 0,p_limit integer default 100,p_website text default null
) returns jsonb language plpgsql stable security definer set search_path='' as $$
declare source text; sources integer; items jsonb; next_id bigint; version bigint;
begin
 if auth.uid() is null or not exists(select 1 from public.profiles where id=auth.uid() and active)
 or private.totus_can('productos','view') is not true or private.totus_local_store_access(p_store) is not true
 then raise exception 'No tienes acceso al catálogo de esta tienda.';end if;
 if p_resource is null or p_resource<>all(array['languages','categories','product_options','product_option_values',
 'product_features','product_feature_values','tags','tax_rule_groups','tax_rules','taxes','countries'])
 or p_after is null or p_after<0 or p_limit is null or p_limit not between 1 and 100
 then raise exception 'Consulta auxiliar de productos no válida.';end if;
 select count(*),min(w.key) into sources,source from private.totus_websites w
 where w.business_id=p_store and (p_website is null or w.key=p_website);
 if p_website is not null and sources=0 then raise exception 'El origen no pertenece a esta tienda.';end if;
 if sources>1 then raise exception 'Selecciona el origen de los datos de esta tienda.';end if;
 select coalesce(c.revision,0) into version from private.totus_web_source_counters c where c.website_key=source and c.resource=p_resource;
 select coalesce(jsonb_agg(r.data||jsonb_build_object('id',r.source_id::text) order by r.source_id),'[]'),max(r.source_id)
 into items,next_id from (select data,source_id from private.totus_web_source_records
 where website_key=source and resource=p_resource and source_id>p_after order by source_id limit p_limit) r;
 return jsonb_build_object('storeId',p_store,'resource',p_resource,'website',source,'revision',coalesce(version,0),
 'items',items,'nextCursor',case when next_id is not null and exists(select 1 from private.totus_web_source_records
 where website_key=source and resource=p_resource and source_id>next_id) then next_id else null end);
end $$;
revoke all on function public.totus_central_product_resources(uuid,text,bigint,integer,text) from public,anon;
grant execute on function public.totus_central_product_resources(uuid,text,bigint,integer,text) to authenticated;
commit;
