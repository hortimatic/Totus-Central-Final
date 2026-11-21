-- Derived metadata only; business data continues to enter through the UI importer.
begin;
lock table private.totus_web_source_records in share row exclusive mode;
create table if not exists private.totus_web_source_counters(
 website_key text not null references private.totus_websites(key),resource text not null,
 records bigint not null check(records>=0),revision bigint not null default 1,
 primary key(website_key,resource)
);
alter table private.totus_web_source_counters enable row level security;
revoke all on private.totus_web_source_counters from public,anon,authenticated;
insert into private.totus_web_source_counters(website_key,resource,records)
 select website_key,resource,count(*) from private.totus_web_source_records group by website_key,resource
 on conflict(website_key,resource) do update set records=excluded.records,revision=private.totus_web_source_counters.revision+1;
create or replace function private.totus_web_source_counter_change() returns trigger
language plpgsql security definer set search_path='' as $$
begin
 if tg_op='INSERT' then
  insert into private.totus_web_source_counters(website_key,resource,records)
   select website_key,resource,count(*) from new_rows group by website_key,resource
   on conflict(website_key,resource) do update set records=private.totus_web_source_counters.records+excluded.records,revision=private.totus_web_source_counters.revision+1;
 elsif tg_op='DELETE' then
  update private.totus_web_source_counters s set records=s.records-d.n,revision=s.revision+1
   from(select website_key,resource,count(*) n from old_rows group by website_key,resource)d
   where s.website_key=d.website_key and s.resource=d.resource;
 else
  update private.totus_web_source_counters s set records=s.records+d.n,revision=s.revision+1
   from(select website_key,resource,sum(delta) n from(
    select website_key,resource,count(*) delta from new_rows group by website_key,resource
    union all select website_key,resource,-count(*) delta from old_rows group by website_key,resource
   )x group by website_key,resource)d where s.website_key=d.website_key and s.resource=d.resource;
  insert into private.totus_web_source_counters(website_key,resource,records)
   select n.website_key,n.resource,count(*) from new_rows n where not exists(
    select 1 from private.totus_web_source_counters s where s.website_key=n.website_key and s.resource=n.resource)
   group by n.website_key,n.resource;
 end if;
 return null;
end $$;
revoke all on function private.totus_web_source_counter_change() from public,anon,authenticated;
drop trigger if exists totus_source_counter_insert on private.totus_web_source_records;
drop trigger if exists totus_source_counter_update on private.totus_web_source_records;
drop trigger if exists totus_source_counter_delete on private.totus_web_source_records;
create trigger totus_source_counter_insert after insert on private.totus_web_source_records referencing new table as new_rows for each statement execute function private.totus_web_source_counter_change();
create trigger totus_source_counter_update after update on private.totus_web_source_records referencing old table as old_rows new table as new_rows for each statement execute function private.totus_web_source_counter_change();
create trigger totus_source_counter_delete after delete on private.totus_web_source_records referencing old table as old_rows for each statement execute function private.totus_web_source_counter_change();
commit;
