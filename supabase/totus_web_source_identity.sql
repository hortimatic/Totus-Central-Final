-- Preserve external identity, including legitimate duplicate references.
-- No business rows are inserted, renamed, merged or deleted.
begin;
do $identity$
declare rel text;
begin
 foreach rel in array array['products','product_variants','brands','ops_customers','ops_suppliers'] loop
  execute format('alter table public.%I add column if not exists source_website text references private.totus_websites(key)',rel);
  execute format('alter table public.%I add column if not exists source_id bigint',rel);
  if not exists(select 1 from pg_constraint where conrelid=format('public.%I',rel)::regclass and conname=rel||'_source_identity_check') then
   execute format('alter table public.%I add constraint %I check ((source_website is null and source_id is null) or (source_website is not null and source_id is not null and source_id>0))',rel,rel||'_source_identity_check');
  end if;
  execute format('create unique index if not exists %I on public.%I(source_website,source_id) where source_website is not null',rel||'_source_identity_unique',rel);
 end loop;
end $identity$;
alter table public.products drop constraint if exists products_sku_key;
drop index if exists public.products_normalized_sku;
create unique index if not exists products_manual_store_sku on public.products(coalesce(store_id,'00000000-0000-0000-0000-000000000000'::uuid),lower(btrim(sku))) where source_website is null;
alter table public.product_variants drop constraint if exists product_variants_sku_key;
drop index if exists public.variants_normalized_sku;
create unique index if not exists variants_manual_product_sku on public.product_variants(product_id,lower(btrim(sku))) where source_website is null;
alter table public.brands drop constraint if exists brands_name_key;
create unique index if not exists brands_manual_store_name on public.brands(coalesce(store_id,'00000000-0000-0000-0000-000000000000'::uuid),lower(btrim(name))) where source_website is null;
drop index if exists public.ops_customers_tax_id_unique_ci;
create unique index if not exists customers_manual_store_tax_id on public.ops_customers(coalesce(store_id,'00000000-0000-0000-0000-000000000000'::uuid),lower(btrim(tax_id))) where source_website is null and btrim(coalesce(tax_id,''))<>'';
drop index if exists public.ops_suppliers_name_no_tax_unique;
drop index if exists public.ops_suppliers_tax_id_unique;
drop index if exists public.ops_suppliers_tax_id_unique_ci;
create unique index if not exists suppliers_manual_store_tax_id on public.ops_suppliers(coalesce(store_id,'00000000-0000-0000-0000-000000000000'::uuid),lower(btrim(tax_id))) where source_website is null and btrim(coalesce(tax_id,''))<>'';
create unique index if not exists suppliers_manual_store_name on public.ops_suppliers(coalesce(store_id,'00000000-0000-0000-0000-000000000000'::uuid),lower(btrim(name))) where source_website is null and btrim(coalesce(tax_id,''))='';
create or replace function private.totus_source_identity_guard() returns trigger language plpgsql security invoker set search_path='' as $$
begin
 if current_user in ('authenticated','anon') then
  if tg_op='INSERT' and new.source_website is not null then raise exception 'La identidad de origen se asigna mediante la importación autorizada.';end if;
  if tg_op='UPDATE' and (new.source_website is distinct from old.source_website or new.source_id is distinct from old.source_id) then raise exception 'No puedes trasladar la identidad de origen de este registro.';end if;
 end if;
 return new;
end $$;
revoke all on function private.totus_source_identity_guard() from public,anon,authenticated;
do $guards$ declare rel text;begin
 foreach rel in array array['products','product_variants','brands','ops_customers','ops_suppliers'] loop
  execute format('drop trigger if exists %I on public.%I',rel||'_source_identity_guard',rel);
  execute format('create trigger %I before insert or update on public.%I for each row execute function private.totus_source_identity_guard()',rel||'_source_identity_guard',rel);
 end loop;
end $guards$;
commit;
