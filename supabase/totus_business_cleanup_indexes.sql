-- Index the actual foreign-key paths used for catalogue cleanup and cascades.
create index if not exists totus_local_catalogue_product_cleanup_idx on private.totus_tpv_local_catalogue(product_id);
create index if not exists totus_local_catalogue_variant_cleanup_idx on private.totus_tpv_local_catalogue(variant_id);
create index if not exists totus_native_catalogue_job_cleanup_idx on private.totus_web_native_catalogue_items(job_id);
create index if not exists totus_web_projection_product_cleanup_idx on private.totus_web_product_projection(product_id);
create index if not exists products_supplier_cleanup_idx on public.products(supplier_id);
create index if not exists products_brand_cleanup_idx on public.products(brand_id);
