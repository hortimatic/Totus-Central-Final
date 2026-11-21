-- User-driven native product copies. Source identities are never reused.
begin;
create table if not exists private.totus_central_product_copy_requests(
 id uuid primary key,actor_id uuid not null,
 store_id uuid not null references public.ops_stores(id) on delete cascade,
 source_store_id uuid not null references public.ops_stores(id) on delete cascade,
 intent jsonb not null,result jsonb not null,created_at timestamptz not null default now()
);
alter table private.totus_central_product_copy_requests enable row level security;
revoke all on private.totus_central_product_copy_requests from public,anon,authenticated;

create or replace function public.totus_central_product_copy(
 p_action text,p_source_store uuid,p_source_product uuid,p_target_store uuid,
 p_request uuid,p_data jsonb,p_revision text default null
) returns jsonb language plpgsql security definer set search_path='' as $$
declare actor uuid:=auth.uid();source public.products;variant public.product_variants;
 entry private.totus_tpv_local_catalogue;prior private.totus_central_product_copy_requests;
 source_json jsonb;variants_json jsonb;catalogue_json jsonb;intent jsonb;result jsonb;
 revision text;new_product_id uuid;new_variant_id uuid;variant_map jsonb:='{}';next_data jsonb;
 details jsonb;stock_copy boolean;chosen uuid;group_pair record;attribute_value text;
 groups jsonb;values_list jsonb;matches jsonb;group_id text;master_result jsonb;
 source_variants integer;default_source text;default_target text;item_id uuid;raw_variant jsonb;variant_metadata jsonb:='{}';
begin
 if actor is null or not exists(select 1 from public.profiles where id=actor and active)
 or p_action is null or p_action not in('preview','commit','recover')
 or private.totus_can('productos','view') is not true
 or private.totus_can('productos','create') is not true
 or private.totus_local_store_access(p_source_store) is not true
 or private.totus_local_store_access(p_target_store) is not true
 then raise exception 'No tienes acceso al origen y destino de la copia.';end if;
 if p_request is null or p_source_product is null or jsonb_typeof(p_data) is distinct from 'object'
 or octet_length(p_data::text)>4000 or p_data-array['name','reference','copyStock','brandId','supplierId']<>'{}'::jsonb
 or jsonb_typeof(p_data->'name') is distinct from 'string'
 or char_length(btrim(p_data->>'name')) not between 1 and 255
 or jsonb_typeof(p_data->'reference') is distinct from 'string'
 or char_length(btrim(p_data->>'reference')) not between 1 and 120
 or jsonb_typeof(p_data->'copyStock') is distinct from 'boolean'
 then raise exception 'Revisa el nombre, la referencia y las opciones de la copia.';end if;
 intent:=jsonb_build_object('sourceStore',p_source_store,'sourceProduct',p_source_product,
 'targetStore',p_target_store,'data',p_data,'revision',p_revision);
 perform pg_advisory_xact_lock(hashtextextended('central-product-copy-request:'||p_request::text,0));
 select * into prior from private.totus_central_product_copy_requests where id=p_request;
 if found then
  if prior.actor_id<>actor or prior.intent<>intent then raise exception 'Esta solicitud ya corresponde a otra copia.';end if;
  return prior.result;
 end if;
 if p_action='recover' then return jsonb_build_object('status','absent','storeId',p_target_store);end if;
 -- Same order as the attribute editor: store context, attribute mutex, product,
 -- catalogue, variants. This also makes source snapshots coherent.
 for chosen in select id from public.ops_stores where id in(p_source_store,p_target_store) order by id for key share loop
  perform pg_advisory_xact_lock(hashtextextended('central-attributes:'||chosen::text,0));
 end loop;
 select * into source from public.products where id=p_source_product and store_id=p_source_store for share;
 if not found then raise exception 'El producto de origen ya no existe en esta tienda.';end if;
 perform 1 from private.totus_tpv_local_catalogue where store_id=p_source_store and product_id=source.id order by id for share;
 perform 1 from public.product_variants where product_id=source.id order by id for share;
 source_json:=to_jsonb(source);
 select coalesce(jsonb_agg(to_jsonb(v) order by v.id),'[]') into variants_json from public.product_variants v where v.product_id=source.id;
 select coalesce(jsonb_agg(to_jsonb(c) order by c.id),'[]') into catalogue_json from private.totus_tpv_local_catalogue c where c.store_id=p_source_store and c.product_id=source.id;
 revision:=md5(jsonb_build_object('product',source_json,'variants',variants_json,'catalogue',catalogue_json)::text);
 if p_action='commit' and p_revision is distinct from revision then raise exception 'El origen ha cambiado. Revisa otra vez la copia antes de confirmar.';end if;
 stock_copy:=(p_data->>'copyStock')::boolean;
 if stock_copy and private.totus_can('productos','edit') is not true then raise exception 'No tienes permiso para copiar existencias.';end if;
 if nullif(p_data->>'brandId','') is not null and not exists(select 1 from public.brands where id=(p_data->>'brandId')::uuid and store_id=p_target_store) then raise exception 'Selecciona una marca del destino.';end if;
 if nullif(p_data->>'supplierId','') is not null and not exists(select 1 from public.ops_suppliers where id=(p_data->>'supplierId')::uuid and store_id=p_target_store) then raise exception 'Selecciona un proveedor del destino.';end if;
 if source.brand_id is not null and nullif(p_data->>'brandId','') is null then raise exception 'Selecciona la correspondencia de la marca en destino.';end if;
 if source.supplier_id is not null and nullif(p_data->>'supplierId','') is null then raise exception 'Selecciona la correspondencia del proveedor en destino.';end if;
 if exists(select 1 from public.products where store_id=p_target_store and lower(btrim(sku))=lower(btrim(p_data->>'reference'))) then raise exception 'La referencia ya existe en destino. Indica otra para crear una copia independiente.';end if;
 source_variants:=jsonb_array_length(variants_json);
 if (source_variants=0 and (jsonb_array_length(catalogue_json)<>1 or catalogue_json->0->>'variant_id' is not null))
 or (source_variants>0 and (jsonb_array_length(catalogue_json)<>source_variants or exists(
 select 1 from public.product_variants v where v.product_id=source.id and
 (select count(*) from private.totus_tpv_local_catalogue c where c.store_id=p_source_store and c.product_id=source.id and c.variant_id=v.id)<>1)))
 then raise exception 'El catálogo de origen está incompleto. Revisa sus combinaciones y precios.';end if;
 if exists(select 1 from public.product_variants v where v.product_id=source.id and (btrim(v.sku)='' or v.attributes='{}'))
 or exists(select 1 from public.product_variants v where v.product_id=source.id group by lower(btrim(v.sku)) having count(*)>1)
 then raise exception 'Completa las referencias únicas y atributos de las combinaciones antes de copiar.';end if;
 -- Until the relation mapper is applied, never silently assign source website
 -- category/feature/image IDs to an unrelated destination.
 if p_source_store<>p_target_store and (
 jsonb_array_length(coalesce(source.details#>'{sourceData,associations,categories}','[]'))>0
 or jsonb_array_length(coalesce(source.details#>'{sourceData,associations,product_features}','[]'))>0
 or jsonb_array_length(coalesce(source.details#>'{sourceData,associations,images}','[]'))>0)
 then raise exception 'Esta copia necesita correspondencias de categorías, características o imágenes entre las tiendas. No se ha copiado ni omitido ningún dato.';end if;
 result:=jsonb_build_object('status','prepared','sourceStoreId',p_source_store,'sourceProductId',source.id,
 'storeId',p_target_store,'revision',revision,'name',btrim(p_data->>'name'),'reference',btrim(p_data->>'reference'),
 'variants',source_variants,'catalogueItems',jsonb_array_length(catalogue_json),'copyStock',stock_copy,
 'stock',case when stock_copy then (select coalesce(sum((x->>'stock')::numeric),0) from jsonb_array_elements(catalogue_json) x) else 0 end);
 if p_action='preview' then return result;end if;
 perform pg_advisory_xact_lock(hashtextextended('central-product-reference:'||p_target_store::text||':'||lower(btrim(p_data->>'reference')),0));
 if exists(select 1 from public.products where store_id=p_target_store and lower(btrim(sku))=lower(btrim(p_data->>'reference'))) then raise exception 'La referencia acaba de crearse en destino. Revisa la copia.';end if;
 new_product_id:=gen_random_uuid();
 details:=(source.details-array['defaultVariantId','nativePrice','catalogueRevisions','expectedRevision'])||jsonb_build_object('name',btrim(p_data->>'name'),'reference',btrim(p_data->>'reference'),'brandId',nullif(p_data->>'brandId','')::uuid,'supplierId',nullif(p_data->>'supplierId','')::uuid,'active',false);
 details:=details||jsonb_build_object('copyProvenance',jsonb_build_object('sourceStoreId',p_source_store,
 'sourceProductId',source.id,'sourceRevision',revision,'copiedAt',clock_timestamp(),
 'sourceSnapshot',jsonb_build_object('product',jsonb_set(source_json,'{details}',source.details-'copyProvenance'),'variants',variants_json,'catalogue',catalogue_json)),
 'metadataWebsite',coalesce(source.source_website,source.details->>'metadataWebsite'));
 -- This is a new native identity, never an imported record with a reused ID.
 if details?'sourceData' then details:=jsonb_set(details,'{sourceData}',(details->'sourceData')-array['id','cache_default_attribute','id_default_combination']);end if;
 next_data:=source_json||jsonb_build_object('id',new_product_id,'store_id',p_target_store,'source_website',null,'source_id',null,
 'family_id',case when p_source_store=p_target_store then source.family_id else null end,
 'name',btrim(p_data->>'name'),'sku',btrim(p_data->>'reference'),'brand_id',nullif(p_data->>'brandId','')::uuid,
 'supplier_id',nullif(p_data->>'supplierId','')::uuid,'details',details,'status','ACEPTADO','units_month',0,
 'created_by',actor,'created_at',clock_timestamp(),'updated_at',clock_timestamp());
 insert into public.products select (jsonb_populate_record(null::public.products,next_data)).*;
 default_source:=source.details->>'defaultVariantId';
 if default_source is null then select v.id::text into default_source from public.product_variants v where v.product_id=source.id
 and v.source_id::text=coalesce(source.details#>>'{nativePrice,attribute_id}',source.details#>>'{sourceData,cache_default_attribute}',source.details#>>'{sourceData,id_default_combination}');end if;
 for variant in select * from public.product_variants where product_id=source.id order by id loop
  new_variant_id:=gen_random_uuid();variant_map:=variant_map||jsonb_build_object(variant.id::text,new_variant_id);
  next_data:=to_jsonb(variant)||jsonb_build_object('id',new_variant_id,'product_id',new_product_id,'source_website',null,'source_id',null,'active',false,'created_at',clock_timestamp());
  insert into public.product_variants select (jsonb_populate_record(null::public.product_variants,next_data)).*;
  select r.data into raw_variant from private.totus_web_source_records r where r.website_key=coalesce(variant.source_website,source.source_website) and r.resource='combinations' and r.source_id=variant.source_id;
  if raw_variant is not null and raw_variant->>'id_product' is distinct from source.source_id::text then raise exception 'Los datos originales de una combinación no corresponden a este producto.';end if;
  variant_metadata:=variant_metadata||jsonb_build_object(new_variant_id::text,coalesce(source.details#>array['copyVariantMetadata',variant.id::text],raw_variant,'{}'::jsonb));
  if variant.id::text=default_source then default_target:=new_variant_id::text;end if;
 end loop;
 for entry in select * from private.totus_tpv_local_catalogue where store_id=p_source_store and product_id=source.id order by id loop
  new_variant_id:=nullif(variant_map->>entry.variant_id::text,'')::uuid;
  item_id:=coalesce(new_variant_id,new_product_id);
  insert into private.totus_tpv_local_catalogue(store_id,id,product_id,variant_id,name,reference,ean,price_cents,tax_basis_points,stock,quantity_unit,metadata,revision,active)
  values(p_target_store,item_id,new_product_id,new_variant_id,
   case when new_variant_id is null then btrim(p_data->>'name') else btrim(p_data->>'name')||' · '||(select name from public.product_variants where id=new_variant_id) end,
   case when new_variant_id is null then btrim(p_data->>'reference') else entry.reference end,
   entry.ean,entry.price_cents,entry.tax_basis_points,case when stock_copy then entry.stock else 0 end,entry.quantity_unit,
   (entry.metadata-array['sourceWebsite','sourceProductId','sourceVariantId','brandId'])||jsonb_build_object('brandId',nullif(p_data->>'brandId','')::uuid),1,false);
  insert into private.totus_tpv_local_audit(actor_id,action,record_id,previous,current)
  values(actor,'catalogue',item_id,null,(select to_jsonb(c) from private.totus_tpv_local_catalogue c where c.store_id=p_target_store and c.id=item_id));
 end loop;
 update public.products p set details=p.details||jsonb_build_object('copyVariantMetadata',variant_metadata)||case when default_target is not null then jsonb_build_object('defaultVariantId',default_target) else '{}'::jsonb end where p.id=new_product_id;
 -- Own attribute masters must exist in the destination too. Never bind groups
 -- by a source numeric ID; exact unambiguous names resolve their own IDs.
 for group_pair in select distinct a.key,a.value from public.product_variants v cross join lateral jsonb_each_text(v.attributes) a where v.product_id=new_product_id order by a.key,a.value loop
  select coalesce(jsonb_agg(x),'[]') into matches from private.totus_central_attribute_rows(p_target_store,'product_options') x where lower(btrim(x->>'name'))=lower(btrim(group_pair.key));
  if jsonb_array_length(matches)>1 then raise exception 'Hay varios grupos de atributos con el mismo nombre en destino. Resuelve la correspondencia antes de copiar.';end if;
  if jsonb_array_length(matches)=0 then
   master_result:=public.totus_central_attribute_save(p_target_store,'product_options','create',null,jsonb_build_object('name',group_pair.key,'public_name',group_pair.key,'group_type','select'),gen_random_uuid(),null);
   group_id:=master_result->>'recordId';
  else group_id:=matches->0->>'id';end if;
  select coalesce(jsonb_agg(x),'[]') into matches from private.totus_central_attribute_rows(p_target_store,'product_option_values') x where x->>'id_attribute_group'=group_id and lower(btrim(x->>'name'))=lower(btrim(group_pair.value));
  if jsonb_array_length(matches)>1 then raise exception 'Hay valores de atributo duplicados en destino. Revisa la correspondencia antes de copiar.';end if;
  if jsonb_array_length(matches)=0 then perform public.totus_central_attribute_save(p_target_store,'product_option_values','create',null,jsonb_build_object('name',group_pair.value,'id_attribute_group',group_id),gen_random_uuid(),null);end if;
 end loop;
 result:=result||jsonb_build_object('status','completed','saved',true,'productId',new_product_id,'variantMap',variant_map,'active',false);
 insert into private.totus_central_product_copy_requests(id,actor_id,store_id,source_store_id,intent,result) values(p_request,actor,p_target_store,p_source_store,intent,result);
 return result;
end $$;
revoke all on function public.totus_central_product_copy(text,uuid,uuid,uuid,uuid,jsonb,text) from public,anon;
grant execute on function public.totus_central_product_copy(text,uuid,uuid,uuid,uuid,jsonb,text) to authenticated;
commit;
