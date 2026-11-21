-- Central-owned edits override saved source metadata; no API key or source row is modified.
begin;
create table if not exists private.totus_central_attributes(
 store_id uuid not null references public.ops_stores(id) on delete cascade,
 resource text not null check(resource in('product_options','product_option_values','product_features','product_feature_values')),
 id text not null, source_website text, data jsonb not null, source_snapshot jsonb,
 deleted boolean not null default false,updated_at timestamptz not null default now(),
 primary key(store_id,resource,id)
);
create table if not exists private.totus_central_attribute_requests(
 id uuid primary key,actor_id uuid not null,store_id uuid not null references public.ops_stores(id) on delete cascade,
 intent jsonb not null,result jsonb not null,created_at timestamptz not null default now()
);
alter table private.totus_central_attributes enable row level security;
alter table private.totus_central_attribute_requests enable row level security;
revoke all on private.totus_central_attributes,private.totus_central_attribute_requests from public,anon,authenticated;

create or replace function private.totus_central_attribute_rows(p_store uuid,p_resource text) returns setof jsonb
language plpgsql stable security invoker set search_path='' as $$
declare origin text;origins integer;
begin
 select count(*),min(key) into origins,origin from private.totus_websites where business_id=p_store;
 if origins>1 then raise exception 'Selecciona el origen de los atributos de esta tienda.';end if;
 return query with base as(select source_id::text id,data from private.totus_web_source_records where website_key=origin and resource=p_resource),
 effective as(select coalesce(o.id,b.id) id,coalesce(o.data,b.data) data,coalesce(o.deleted,false) deleted
 from base b full join (select * from private.totus_central_attributes where store_id=p_store and resource=p_resource) o on o.id=b.id and o.source_website is not distinct from origin)
 select data||jsonb_build_object('id',id,'__central',true,'__revision',md5(data::text)) from effective where not deleted order by id;
end $$;
revoke all on function private.totus_central_attribute_rows(uuid,text) from public,anon,authenticated;

create or replace function public.totus_central_attribute_catalogue(p_store uuid,p_resource text) returns jsonb
language plpgsql stable security definer set search_path='' as $$
begin
 if auth.uid() is null or not exists(select 1 from public.profiles where id=auth.uid() and active)
 or private.totus_can('productos','view') is not true or private.totus_local_store_access(p_store) is not true
 then raise exception 'No tienes acceso a los atributos de esta tienda.';end if;
 if p_resource is null or p_resource<>all(array['product_options','product_option_values','product_features','product_feature_values']) then raise exception 'Tipo de atributo no válido.';end if;
 return jsonb_build_object('storeId',p_store,'resource',p_resource,'items',coalesce((select jsonb_agg(value) from private.totus_central_attribute_rows(p_store,p_resource) value),'[]'));
end $$;
revoke all on function public.totus_central_attribute_catalogue(uuid,text) from public,anon;
grant execute on function public.totus_central_attribute_catalogue(uuid,text) to authenticated;

create or replace function public.totus_central_attribute_save(p_store uuid,p_resource text,p_operation text,p_id text,p_fields jsonb,p_request uuid,p_revision text default null) returns jsonb
language plpgsql security definer set search_path='' as $$
declare actor uuid:=auth.uid();permission text;allowed text[];entry jsonb;next_data jsonb;old_parent jsonb;parent jsonb;parent_resource text;parent_field text;origin text;rid text;intent jsonb;result jsonb;prior private.totus_central_attribute_requests;old_name text;new_name text;group_name text;old_group text;changed_variants uuid[]:=array[]::uuid[];
begin
 permission:=case p_operation when 'create' then 'create' when 'update' then 'edit' when 'delete' then 'delete' end;
 if actor is null or not exists(select 1 from public.profiles where id=actor and active) or permission is null
 or private.totus_can('productos',permission) is not true or private.totus_local_store_access(p_store) is not true
 then raise exception 'No tienes permiso para esta operación de atributos.';end if;
 allowed:=case p_resource when 'product_options' then array['name','public_name','group_type','position'] when 'product_option_values' then array['name','id_attribute_group','color','position'] when 'product_features' then array['name','position'] when 'product_feature_values' then array['value','id_feature','custom'] end;
 if allowed is null or p_request is null or jsonb_typeof(p_fields) is distinct from 'object' or octet_length(p_fields::text)>20000 or p_fields-allowed<>'{}'::jsonb
 or exists(select 1 from jsonb_each(p_fields) x where jsonb_typeof(x.value)<>'string' or char_length(x.value#>>'{}')>255 or (x.value#>>'{}')~'[[:cntrl:]]') then raise exception 'Revisa los campos del atributo.';end if;
 intent:=jsonb_build_object('store',p_store,'resource',p_resource,'operation',p_operation,'id',p_id,'fields',p_fields,'revision',p_revision);
 perform pg_advisory_xact_lock(hashtextextended('central-attribute-request:'||p_request::text,0));
 select * into prior from private.totus_central_attribute_requests where id=p_request;
 if found then if prior.actor_id<>actor or prior.intent<>intent then raise exception 'La solicitud ya corresponde a otros cambios.';end if;return prior.result;end if;
 perform 1 from public.ops_stores where id=p_store for key share;
 perform 1 from private.totus_websites where business_id=p_store for key share;
 perform pg_advisory_xact_lock(hashtextextended('central-attributes:'||p_store::text,0));
 select min(key) into origin from private.totus_websites where business_id=p_store;
 if p_id~'^[1-9][0-9]{0,14}$' then perform 1 from private.totus_web_source_records where website_key=origin and resource=p_resource and source_id=p_id::bigint for share;end if;
 if p_operation='create' then if p_id is not null then raise exception 'El alta no acepta un identificador existente.';end if;rid:=gen_random_uuid()::text;
 else rid:=p_id;select value into entry from private.totus_central_attribute_rows(p_store,p_resource) value where value->>'id'=rid;
 if entry is null then raise exception 'El atributo no pertenece a esta tienda o ya no existe.';end if;
 if entry->>'__revision' is distinct from p_revision then raise exception 'El atributo ha cambiado. Vuelve a abrirlo antes de guardar.';end if;end if;
 next_data:=(coalesce(entry,'{}')-array['id','__central','__revision'])||p_fields;
 if p_operation<>'delete' then
 if p_resource in('product_options','product_option_values','product_features') and (btrim(coalesce(next_data->>'name',''))='' or (next_data->>'name')~'[<>{}=]') then raise exception 'Indica un nombre válido.';end if;
 if p_resource='product_options' and (btrim(coalesce(next_data->>'public_name',''))='' or coalesce(next_data->>'group_type','select') not in('select','radio','color')) then raise exception 'Completa el nombre público y el tipo de atributo.';end if;
 if p_resource='product_feature_values' and btrim(coalesce(next_data->>'value',''))='' then raise exception 'Indica el valor de la característica.';end if;
 if next_data?'position' and next_data->>'position'!~'^[0-9]{1,7}$' or next_data?'color' and next_data->>'color'<>'' and next_data->>'color'!~'^#[a-fA-F0-9]{6}$' or next_data?'custom' and next_data->>'custom' not in('0','1') then raise exception 'Revisa posición, color o tipo de valor.';end if;
 end if;
 parent_field:=case p_resource when 'product_option_values' then 'id_attribute_group' when 'product_feature_values' then 'id_feature' end;
 parent_resource:=case p_resource when 'product_option_values' then 'product_options' when 'product_feature_values' then 'product_features' end;
 if parent_field is not null then
 select value into parent from private.totus_central_attribute_rows(p_store,parent_resource) value where value->>'id'=next_data->>parent_field;
 if parent is null then raise exception 'Selecciona un grupo de esta tienda.';end if;
 if entry is not null then select value into old_parent from private.totus_central_attribute_rows(p_store,parent_resource) value where value->>'id'=entry->>parent_field;end if;
 end if;
 if p_operation='delete' and ((p_resource in('product_options','product_features') and exists(select 1 from private.totus_central_attribute_rows(p_store,case p_resource when 'product_options' then 'product_option_values' else 'product_feature_values' end) value where value->>case p_resource when 'product_options' then 'id_attribute_group' else 'id_feature' end=rid))
 or p_resource='product_options' and exists(select 1 from public.product_variants v join public.products p on p.id=v.product_id where p.store_id=p_store and v.attributes ? (entry->>'name'))
 or p_resource='product_option_values' and exists(select 1 from public.product_variants v join public.products p on p.id=v.product_id where p.store_id=p_store and v.attributes->>(parent->>'name')=entry->>'name')
 or p_resource in('product_features','product_feature_values') and exists(select 1 from public.products p cross join lateral jsonb_array_elements(coalesce(p.details#>'{sourceData,associations,product_features}','[]')) f where p.store_id=p_store and f->>case p_resource when 'product_features' then 'id' else 'id_feature_value' end=rid))
 then raise exception 'El atributo tiene valores o productos asociados. Retira esas relaciones antes de eliminarlo.';end if;
 if p_operation<>'delete' and p_resource in('product_options','product_option_values') then
 if exists(select 1 from private.totus_central_attribute_rows(p_store,p_resource) value where value->>'id'<>rid and lower(btrim(value->>'name'))=lower(btrim(next_data->>'name')) and (parent_field is null or value->>parent_field=next_data->>parent_field)) then raise exception 'Ya existe ese nombre en este grupo o tienda.';end if;
 old_name:=entry->>'name';new_name:=next_data->>'name';group_name:=parent->>'name';old_group:=old_parent->>'name';
 if old_name is not null and (old_name<>new_name or p_resource='product_option_values' and old_group is distinct from group_name) then
 if p_resource='product_options' and exists(select 1 from private.totus_central_attribute_rows(p_store,'product_options') value where value->>'id'<>rid and value->>'name'=old_name)
 or p_resource='product_option_values' and (exists(select 1 from private.totus_central_attribute_rows(p_store,'product_options') value where value->>'id'<>entry->>'id_attribute_group' and value->>'name'=old_group)
 or exists(select 1 from private.totus_central_attribute_rows(p_store,'product_option_values') value where value->>'id'<>rid and value->>'id_attribute_group'=entry->>'id_attribute_group' and value->>'name'=old_name))
 then raise exception 'Hay grupos o valores importados con el mismo nombre. Revisa su correspondencia por identificador antes de renombrarlos.';end if;
 end if;
 if old_name is not null and (old_name<>new_name or p_resource='product_option_values' and old_group is distinct from group_name) then
 -- Use the same catalogue-before-variant lock order as the product editor.
 perform 1 from private.totus_tpv_local_catalogue c join public.product_variants v on v.id=c.variant_id
 where c.store_id=p_store and (p_resource='product_options' and v.attributes?old_name or p_resource='product_option_values' and v.attributes->>old_group=old_name) order by c.id for update of c;
 perform 1 from public.product_variants v join public.products p on p.id=v.product_id
 where p.store_id=p_store and (p_resource='product_options' and v.attributes?old_name or p_resource='product_option_values' and v.attributes->>old_group=old_name) order by v.id for update of v;
 end if;
 if p_resource='product_options' and old_name is not null and old_name<>new_name then
 if exists(select 1 from public.product_variants v join public.products p on p.id=v.product_id where p.store_id=p_store and v.attributes?old_name and v.attributes?new_name) then raise exception 'Una combinación ya contiene el nuevo nombre de atributo.';end if;
 with changed as(update public.product_variants v set attributes=(v.attributes-old_name)||jsonb_build_object(new_name,v.attributes->old_name) from public.products p where p.id=v.product_id and p.store_id=p_store and v.attributes?old_name returning v.id) select coalesce(array_agg(id),array[]::uuid[]) into changed_variants from changed;
 elsif p_resource='product_option_values' and old_name is not null and (old_name<>new_name or old_group is distinct from group_name) then
 if old_group is distinct from group_name and exists(select 1 from public.product_variants v join public.products p on p.id=v.product_id where p.store_id=p_store and v.attributes->>old_group=old_name and v.attributes?group_name) then raise exception 'Una combinación ya contiene el grupo de destino.';end if;
 with changed as(update public.product_variants v set attributes=(v.attributes-old_group)||jsonb_build_object(group_name,new_name) from public.products p where p.id=v.product_id and p.store_id=p_store and v.attributes->>old_group=old_name returning v.id) select coalesce(array_agg(id),array[]::uuid[]) into changed_variants from changed;
 end if;
 update public.product_variants v set name=(select string_agg(key||': '||value,' · ' order by key) from jsonb_each_text(v.attributes)) from public.products p where p.id=v.product_id and p.store_id=p_store and v.id=any(changed_variants) and v.name is distinct from (select string_agg(key||': '||value,' · ' order by key) from jsonb_each_text(v.attributes));
 update private.totus_tpv_local_catalogue c set metadata=c.metadata||jsonb_build_object('attributes',v.attributes),name=p.name||' · '||v.name,revision=c.revision+1 from public.product_variants v join public.products p on p.id=v.product_id where c.store_id=p_store and c.variant_id=v.id and v.id=any(changed_variants) and (c.metadata->'attributes' is distinct from v.attributes or c.name is distinct from p.name||' · '||v.name);
 end if;
 insert into private.totus_central_attributes(store_id,resource,id,source_website,data,source_snapshot,deleted)
 values(p_store,p_resource,rid,case when rid~'^[0-9]+$' then origin else null end,next_data,entry,p_operation='delete')
 on conflict(store_id,resource,id) do update set data=excluded.data,deleted=excluded.deleted,updated_at=now();
 result:=jsonb_build_object('storeId',p_store,'resource',p_resource,'recordId',rid,'saved',true,'deleted',p_operation='delete');
 insert into private.totus_central_attribute_requests(id,actor_id,store_id,intent,result) values(p_request,actor,p_store,intent,result);
 return result;
end $$;
revoke all on function public.totus_central_attribute_save(uuid,text,text,text,jsonb,uuid,text) from public,anon;
grant execute on function public.totus_central_attribute_save(uuid,text,text,text,jsonb,uuid,text) to authenticated;
commit;
