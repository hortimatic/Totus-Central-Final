-- Normalize metadata on reads; no business rows are rewritten by installation.
begin;
create or replace function private.totus_central_product_languages(p_record jsonb) returns jsonb
language plpgsql stable security invoker set search_path='' as $$
declare website text:=p_record->>'source_website';details jsonb:=coalesce(p_record->'details','{}');source jsonb:=coalesce(p_record#>'{details,sourceData}','{}');primary_id text;inventory jsonb;fields jsonb:=coalesce(p_record#>'{details,sourceData,__i18n,fields}','{}');field text;alias text;raw jsonb;values_json jsonb;display text;
begin
 if website is null then return p_record;end if;
 primary_id:=source#>>'{__i18n,primaryLanguageId}';
 if primary_id is null then select profile->>'language_id' into primary_id from private.totus_web_native_catalogue_jobs where website_key=website and state='completed' and profile->>'verified'='true' order by created_at desc limit 1;end if;
 if primary_id is null then select language_context->>'primaryLanguageId' into primary_id from private.totus_web_import_jobs where website_key=website and language_context is not null order by created_at desc limit 1;end if;
 if coalesce(primary_id,'')!~'^[1-9][0-9]{0,14}$' then return p_record;end if;
 select coalesce(jsonb_agg(jsonb_build_object('id',source_id::text,'name',data->>'name','isoCode',data->>'iso_code','active',data->>'active'='1') order by source_id),'[]') into inventory from private.totus_web_source_records where website_key=website and resource='languages';
 if not exists(select 1 from jsonb_array_elements(inventory) x where x->>'id'=primary_id and x->>'active'='true') then return p_record;end if;
 for field,alias in select key,value from jsonb_each_text('{"name":"name","description":"description","description_short":"descriptionShort","meta_title":"metaTitle","meta_description":"metaDescription","meta_keywords":"metaKeywords","link_rewrite":"slug","available_now":"available_now","available_later":"available_later","delivery_in_stock":"delivery_in_stock","delivery_out_stock":"delivery_out_stock"}') loop
  raw:=source->field;
  display:=case when field='name' then p_record->>'name' else coalesce(details->>alias,case when jsonb_typeof(raw)='string' then source->>field end) end;
  values_json:=case when jsonb_typeof(raw)='array' then raw when jsonb_typeof(raw->'language')='array' then raw->'language' when jsonb_typeof(fields->field)='array' then fields->field else '[]' end;
  if display is not null and not exists(select 1 from jsonb_array_elements(values_json) x where coalesce(x->>'id',x->>'language_id')=primary_id) then values_json:=values_json||jsonb_build_array(jsonb_build_object('id',primary_id,'value',display));if jsonb_typeof(raw)='array' then source:=jsonb_set(source,array[field],values_json);end if;end if;
  if values_json<>'[]' then fields:=jsonb_set(fields,array[field],values_json);end if;
 end loop;
 source:=source||jsonb_build_object('__i18n',coalesce(source->'__i18n','{}')||jsonb_build_object('primaryLanguageId',primary_id,'languages',inventory,'fields',fields));
 return p_record||jsonb_build_object('details',details||jsonb_build_object('primaryLanguageId',primary_id,'sourceData',source));
end $$;
revoke all on function private.totus_central_product_languages(jsonb) from public,anon,authenticated;
-- Modify only the read/projection clauses, retaining the currently installed
-- permission checks, conflict guards, columns, and earlier workflow repairs.
do $migration$
declare definition text;target regprocedure;
begin
 target:='private.totus_local_store_read_page(uuid,text,text,jsonb,integer,uuid)'::regprocedure;definition:=pg_get_functiondef(target);
 if position('private.totus_central_product_languages(entry.data)' in definition)=0 then
  if position('data:=entry.data;' in definition)=0 then raise exception 'Unexpected native detail reader';end if;
  execute replace(definition,'data:=entry.data;','data:=case when p_kind=''products'' and p_id is not null then private.totus_central_product_languages(entry.data) else entry.data end;');
 end if;
 target:='private.totus_central_product_snapshot(uuid,uuid)'::regprocedure;definition:=pg_get_functiondef(target);
 if position('private.totus_central_product_languages(to_jsonb(p))' in definition)=0 then
  if position('select to_jsonb(p)||' in definition)=0 then raise exception 'Unexpected native snapshot reader';end if;
  execute replace(definition,'select to_jsonb(p)||','select private.totus_central_product_languages(to_jsonb(p))||');
 end if;
 target:='private.totus_web_product_projection(text,bigint,boolean)'::regprocedure;definition:=pg_get_functiondef(target);
 if position('''primaryLanguageId''' in definition)=0 then
  if position('''sourceData'',r.data,' in definition)=0 then raise exception 'Unexpected product projection';end if;
  execute replace(definition,'''sourceData'',r.data,','''sourceData'',r.data,''primaryLanguageId'',coalesce(r.data#>>''{__i18n,primaryLanguageId}'',j.profile->>''language_id''),');
 end if;
end $migration$;
commit;
