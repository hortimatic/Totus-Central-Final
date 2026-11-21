-- Capture only when a user starts price preparation. Never certify old jobs retroactively.
begin;
create table if not exists private.totus_web_native_source_snapshots(
 job_id uuid primary key references private.totus_web_native_catalogue_jobs(id) on delete cascade,
 source_signature text not null,
 created_at timestamptz not null default now()
);
alter table private.totus_web_native_source_snapshots enable row level security;
revoke all on private.totus_web_native_source_snapshots from public,anon,authenticated;
create or replace function private.totus_web_native_source_signature(p_website text)
returns text language sql stable security invoker set search_path='' as $$
 select md5(coalesce(jsonb_agg(jsonb_build_array(resource,records,revision) order by resource)::text,'[]'))
 from private.totus_web_source_counters where website_key=p_website and resource=any(array[
  'languages','categories','manufacturers','suppliers','product_options','product_option_values',
  'product_features','product_feature_values','tags','products','combinations','product_suppliers',
  'specific_prices','specific_price_rules','shops','shop_groups','stores','stock_availables',
  'customers','groups','addresses','countries','states','currencies','taxes','tax_rule_groups','tax_rules','cart_rules'
 ]);
$$;
revoke all on function private.totus_web_native_source_signature(text) from public,anon,authenticated;
create or replace function private.totus_web_native_source_current(p_job uuid)
returns boolean language sql stable security invoker set search_path='' as $$
 select coalesce((select s.source_signature=private.totus_web_native_source_signature(j.website_key)
 from private.totus_web_native_source_snapshots s join private.totus_web_native_catalogue_jobs j on j.id=s.job_id
 where s.job_id=p_job),false);
$$;
revoke all on function private.totus_web_native_source_current(uuid) from public,anon,authenticated;
create or replace function private.totus_web_native_capture_source()
returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into private.totus_web_native_source_snapshots(job_id,source_signature)
 values(new.id,private.totus_web_native_source_signature(new.website_key));
 return new;
end $$;
revoke all on function private.totus_web_native_capture_source() from public,anon,authenticated;
drop trigger if exists totus_web_native_capture_source on private.totus_web_native_catalogue_jobs;
create trigger totus_web_native_capture_source after insert on private.totus_web_native_catalogue_jobs
for each row execute function private.totus_web_native_capture_source();
commit;
