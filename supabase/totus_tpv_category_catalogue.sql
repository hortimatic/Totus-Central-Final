create or replace function public.totus_tpv_local_categories(p_drawer uuid)
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare actor uuid:=totus_tpv_internal.local_authorize(p_drawer,'view');shop uuid;source text;
 categories jsonb;langs jsonb;language_id text;result jsonb;
begin
 select store_id into shop from public.ops_cash_drawers where id=p_drawer;
 if (select count(*) from private.totus_websites where business_id=shop)>1 then raise exception 'La tienda tiene varios orígenes de categorías.';end if;
 select key into source from private.totus_websites where business_id=shop;
 select s.items,s.languages into categories,langs from private.totus_category_snapshots s where s.store_id=shop and (s.website_key is not distinct from source or source is null);
 if categories is null then
  select coalesce(jsonb_agg(data||jsonb_build_object('id',source_id::text)),'[]') into categories from private.totus_web_source_records where website_key=source and resource='categories';
  select coalesce(jsonb_agg(data||jsonb_build_object('id',source_id::text)),'[]') into langs from private.totus_web_source_records where website_key=source and resource='languages';
 end if;
 select r->>'id' into language_id from jsonb_array_elements(langs)r where r->>'active'='1' order by (r->>'iso_code'='es') desc,r->>'id' limit 1;
 select coalesce(jsonb_agg(jsonb_build_object('id',(r->>'id')::bigint,'parentId',(r->>'id_parent')::bigint,
 'name',case when jsonb_typeof(r->'name')='array' then coalesce((select l->>'value' from jsonb_array_elements(r->'name')l where l->>'id'=language_id limit 1),r->'name'->0->>'value','Sin nombre') else coalesce(r->>'name','Sin nombre') end,
 'active',r->>'active'='1','root',r->>'is_root_category'='1' or source is not null and r->>'id_parent'='0')),'[]') into result from jsonb_array_elements(categories)r;
 return jsonb_build_object('storeId',shop,'categories',result);
end $$;
revoke all on function public.totus_tpv_local_categories(uuid) from public,anon;
grant execute on function public.totus_tpv_local_categories(uuid) to authenticated;

-- Preserve the existing authorized catalogue and sales contracts. Enrich only
-- category membership from the Central product belonging to the same store.
create or replace function public.totus_tpv_local_read(p_drawer uuid,p_kind text,p_id uuid default null,p_search text default '',p_limit integer default 50,p_offset integer default 0)
returns jsonb language plpgsql security definer set search_path='' as $$
declare actor uuid:=totus_tpv_internal.local_authorize(p_drawer,'view');store uuid;result jsonb;
begin
 if p_kind is null or p_kind not in('catalogue','sales','credits','sale') or p_search is null or char_length(p_search)>150 or p_limit is null or p_limit not between 1 and 200 or p_offset is null or p_offset not between 0 and 1000000 then raise exception 'TPV_LOCAL_QUERY_INVALID';end if;
 select store_id into store from public.ops_cash_drawers where id=p_drawer;
 if p_kind='sale' then
  if not exists(select 1 from private.totus_tpv_local_sales where id=p_id and store_id=store) then raise exception 'TPV_LOCAL_SALE_NOT_FOUND';end if;
  return totus_tpv_internal.local_sale_json(p_id);
 elsif p_kind='catalogue' then
  select coalesce(jsonb_agg((to_jsonb(x)-'metadata')||jsonb_build_object('metadata',jsonb_build_object(
   'imageUrl',x.metadata->'imageUrl','images',x.metadata->'images','variantAttributes',x.metadata->'variantAttributes',
   'categoryId',case when coalesce(p.details->'sourceData'->>'id_category_default','')~'^[1-9][0-9]{0,14}$' then (p.details->'sourceData'->>'id_category_default')::bigint else coalesce((x.metadata->>'categoryId')::bigint,0) end,
   'categoryIds',coalesce((select jsonb_agg((r->>'id')::bigint) from jsonb_array_elements(case when jsonb_typeof(p.details->'sourceData'->'associations'->'categories')='array' then p.details->'sourceData'->'associations'->'categories' else '[]' end)r where coalesce(r->>'id','')~'^[1-9][0-9]{0,14}$'),'[]'),
   'category',x.metadata->'category')) order by lower(x.name),x.id),'[]') into result
  from (select * from private.totus_tpv_local_catalogue where store_id=store and active and (p_search='' or position(lower(p_search) in lower(name||' '||reference||' '||ean))>0) order by lower(name),id limit p_limit offset p_offset)x
  left join public.products p on p.id=x.product_id and p.store_id=store;
 else
  if p_kind='credits' and private.totus_can('facturacion','view') is not true then raise exception 'TPV_LOCAL_CUSTOMER_FORBIDDEN';end if;
  select coalesce(jsonb_agg(totus_tpv_internal.local_sale_json(x.id) order by x.created_at desc,x.id),'[]') into result from (select * from private.totus_tpv_local_sales where store_id=store and (p_kind<>'credits' or (on_credit and paid_cents<total_cents)) and (p_search='' or position(lower(p_search) in lower(id::text||' '||coalesce(customer_id::text,'')))>0) order by created_at desc,id limit p_limit offset p_offset)x;
 end if;
 return jsonb_build_object('items',result,'hasMore',jsonb_array_length(result)=p_limit);
end $$;
revoke all on function public.totus_tpv_local_read(uuid,text,uuid,text,integer,integer) from public,anon;
grant execute on function public.totus_tpv_local_read(uuid,text,uuid,text,integer,integer) to authenticated;
