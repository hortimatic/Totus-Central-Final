-- A single fiche must not read every imported combination in the shop.
create or replace function public.totus_central_product_variant_detail(p_store uuid,p_variant uuid) returns jsonb
language plpgsql stable security definer set search_path='' as $$
declare parent_id uuid;snapshot jsonb;variant jsonb;original jsonb;
begin
 if auth.uid() is null or not exists(select 1 from public.profiles where id=auth.uid() and active)
 or private.totus_can('productos','view') is not true or private.totus_local_store_access(p_store) is not true then raise exception 'No tienes acceso a esta combinación.';end if;
 select v.product_id into parent_id from public.product_variants v join public.products p on p.id=v.product_id and p.store_id=p_store where v.id=p_variant;
 if not found then raise exception 'La combinación no pertenece a esta tienda.';end if;
 snapshot:=private.totus_central_product_snapshot(p_store,parent_id);
 select value into variant from jsonb_array_elements(snapshot->'variants') where value->>'id'=p_variant::text;
 original:=snapshot#>array['source_combinations',p_variant::text];
 if original is not null and original->>'id_product' is distinct from snapshot->>'source_id' then raise exception 'La combinación original pertenece a otro producto.';end if;
 return jsonb_build_object('storeId',p_store,'variantId',p_variant,'product',snapshot,'original',original);
end $$;
revoke all on function public.totus_central_product_variant_detail(uuid,uuid) from public,anon;
grant execute on function public.totus_central_product_variant_detail(uuid,uuid) to authenticated;
