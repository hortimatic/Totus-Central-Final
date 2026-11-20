-- Page owned directories on the server; load full originals only when opening a record.
begin;
create or replace function private.totus_local_store_read_page(p_store uuid,p_kind text,p_search text default '',p_after jsonb default null,p_limit integer default 50,p_id uuid default null) returns jsonb language plpgsql security definer set search_path='' as $$
declare rel text;module_name text;query text;search_expression text;entry record;data jsonb;items jsonb:='[]';total bigint;n integer:=0;more boolean:=false;last_name text;last_id uuid;after_name text;after_id uuid;
begin
 if auth.uid() is null then raise exception 'Inicia sesión.';end if;
 rel:=case p_kind when 'products' then 'products' when 'customers' then 'ops_customers' when 'suppliers' then 'ops_suppliers' when 'brands' then 'brands' end;
 module_name:=case p_kind when 'products' then 'productos' when 'customers' then 'facturacion' when 'suppliers' then 'gastos' when 'brands' then 'pricing' end;
 if rel is null or private.totus_can(module_name,'view') is not true or private.totus_local_store_access(p_store) is not true then raise exception 'No tienes acceso a este directorio.';end if;
 if p_limit is null or p_limit<1 or p_limit>100 or p_search is null or char_length(p_search)>200 then raise exception 'Revisa la búsqueda y el tamaño de página.';end if;
 if p_after is not null then
  if jsonb_typeof(p_after)<>'object' or not p_after?&array['name','id'] or char_length(p_after->>'name')>510 then raise exception 'Página no válida.';end if;
  after_name:=p_after->>'name';after_id:=(p_after->>'id')::uuid;if after_name is null or after_id is null then raise exception 'Página no válida.';end if;
 end if;
 search_expression:=case p_kind when 'products' then 't.name||'' ''||coalesce(t.sku,'''')||'' ''||coalesce(t.details->>''metaTitle'','''')' when 'brands' then 't.name' else 't.name||'' ''||coalesce(t.email,'''')||'' ''||coalesce(t.phone,'''')||'' ''||coalesce(t.tax_id,'''')' end;
 query:=format(' from public.%I t where t.store_id=$1 and ($2='''' or position(lower($2) in lower(%s))>0) and ($5::uuid is null or t.id=$5)',rel,search_expression);
 execute 'select count(*)'||query into total using p_store,btrim(p_search),after_name,after_id,p_id;
 for entry in execute 'select to_jsonb(t) data,lower(t.name) label,t.id'||query||' and ($3::text is null or (lower(t.name),t.id)>($3,$4::uuid)) order by lower(t.name),t.id limit $6' using p_store,btrim(p_search),after_name,after_id,p_id,case when p_id is null then p_limit+1 else 1 end loop
  n:=n+1;if n>p_limit then more:=true;exit;end if;
  data:=entry.data;last_name:=entry.label;last_id:=entry.id;
  if p_id is null then data:=data-'details';end if;
  if p_kind='products' then
   data:=data||jsonb_build_object('variants',coalesce((select jsonb_agg(to_jsonb(v) order by v.name,v.id) from public.product_variants v where v.product_id=entry.id),'[]'),'catalogue',coalesce((select jsonb_agg(case when p_id is null then to_jsonb(c)-'metadata' else to_jsonb(c) end order by c.reference,c.id) from private.totus_tpv_local_catalogue c where c.store_id=p_store and c.product_id=entry.id),'[]'));
  end if;
  items:=items||jsonb_build_array(data);
 end loop;
 return jsonb_build_object('storeId',p_store,'items',items,'total',total,'nextCursor',case when more then jsonb_build_object('name',last_name,'id',last_id) else null end);
end $$;
revoke all on function private.totus_local_store_read_page(uuid,text,text,jsonb,integer,uuid) from public,anon;
grant execute on function private.totus_local_store_read_page(uuid,text,text,jsonb,integer,uuid) to authenticated;
create or replace function public.totus_local_store_read_page(p_store uuid,p_kind text,p_search text default '',p_after jsonb default null,p_limit integer default 50,p_id uuid default null) returns jsonb language sql security invoker set search_path='' as $$select private.totus_local_store_read_page(p_store,p_kind,p_search,p_after,p_limit,p_id)$$;
revoke all on function public.totus_local_store_read_page(uuid,text,text,jsonb,integer,uuid) from public,anon;
grant execute on function public.totus_local_store_read_page(uuid,text,text,jsonb,integer,uuid) to authenticated;
commit;
