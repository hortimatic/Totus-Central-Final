-- User-triggered adoption of imported directories into Central's own model.
-- Installing this file does not create or change business records.
begin;
alter table public.brands add column if not exists details jsonb not null default '{}';
alter table public.ops_suppliers add column if not exists details jsonb not null default '{}';
create table if not exists private.totus_web_directory_projection(
 website_key text not null references private.totus_websites(key),
 resource text not null check(resource in ('manufacturers','suppliers','customers')),
 source_id bigint not null, local_id uuid not null, source_hash text not null,
 target_hash text not null, conflict boolean not null default false,
 updated_at timestamptz not null default now(), primary key(website_key,resource,source_id)
);
alter table private.totus_web_directory_projection enable row level security;
revoke all on private.totus_web_directory_projection from public,anon,authenticated;

create or replace function private.totus_web_directory_projection(p_website text,p_resource text default null,p_cursor bigint default 0,p_apply boolean default false) returns jsonb
language plpgsql security definer set search_path='' as $body$
declare w private.totus_websites; r record; entry private.totus_web_directory_projection;
 rel text; target jsonb; proposed jsonb; addresses jsonb; main_address jsonb;
 country_name text; state_name text; source_hash text; target_hash text; local_id uuid;
 n integer:=0; conflicts integer:=0; last_id bigint:=p_cursor; total bigint; counts jsonb;
begin
 if auth.uid() is null then raise exception 'Inicia sesión.';end if;
 perform private.totus_api_admin();
 select * into strict w from private.totus_websites where key=p_website;
 if w.business_id is null or private.totus_local_store_access(w.business_id) is not true then raise exception 'Asigna un establecimiento accesible antes de incorporar los datos.';end if;
 if not p_apply then
  select coalesce(jsonb_object_agg(resource,jsonb_build_object('available',available,'incorporated',incorporated,'conflicts',conflicts)),'{}') into counts from (
   select kinds.resource,(select count(*) from private.totus_web_source_records s where s.website_key=w.key and s.resource=kinds.resource) available,
    (select count(*) from private.totus_web_directory_projection p where p.website_key=w.key and p.resource=kinds.resource) incorporated,
    (select count(*) from private.totus_web_directory_projection p where p.website_key=w.key and p.resource=kinds.resource and p.conflict) conflicts
   from unnest(array['manufacturers','suppliers','customers']) kinds(resource)
  ) q;
  return jsonb_build_object('storeId',w.business_id,'resources',counts);
 end if;
 if p_resource is null or p_resource not in ('manufacturers','suppliers','customers') or p_cursor is null or p_cursor<0 then raise exception 'Selecciona un directorio válido.';end if;
 if private.totus_can(case p_resource when 'manufacturers' then 'pricing' when 'suppliers' then 'gastos' else 'facturacion' end,'create') is not true or
    private.totus_can(case p_resource when 'manufacturers' then 'pricing' when 'suppliers' then 'gastos' else 'facturacion' end,'edit') is not true then raise exception 'No tienes permiso para incorporar este directorio.';end if;
 perform pg_advisory_xact_lock(hashtextextended('web-directory:'||w.key,0));
 if exists(select 1 from private.totus_web_import_jobs where website_key=w.key and state in ('running','paused')) then raise exception 'Termina o cancela la importación antes de incorporar sus datos.';end if;
 if not exists(select 1 from private.totus_web_import_jobs where website_key=w.key and state='completed' and p_resource=any(resources)) then raise exception 'Importa por completo el directorio seleccionado.';end if;
 rel:=case p_resource when 'manufacturers' then 'brands' when 'suppliers' then 'ops_suppliers' else 'ops_customers' end;
 for r in select * from private.totus_web_source_records where website_key=w.key and resource=p_resource and source_id>p_cursor order by source_id limit 200 loop
  last_id:=r.source_id;
  select coalesce(jsonb_agg(s.data order by (s.data->>'deleted'='1'),s.source_id),'[]') into addresses
   from private.totus_web_source_records s where s.website_key=w.key and s.resource='addresses' and
   s.data->>(case p_resource when 'manufacturers' then 'id_manufacturer' when 'suppliers' then 'id_supplier' else 'id_customer' end)=r.source_id::text;
  main_address:=coalesce(addresses->0,'{}');
  select coalesce(c.data->>'name','') into country_name from private.totus_web_source_records c where c.website_key=w.key and c.resource='countries' and c.source_id=nullif(main_address->>'id_country','')::bigint;
  select coalesce(s.data->>'name','') into state_name from private.totus_web_source_records s where s.website_key=w.key and s.resource='states' and s.source_id=nullif(main_address->>'id_state','')::bigint;
  source_hash:=md5(jsonb_build_object('record',r.data,'addresses',addresses,'country',country_name,'state',state_name)::text);
  select * into entry from private.totus_web_directory_projection where website_key=w.key and resource=p_resource and source_id=r.source_id for update;
  execute format('select to_jsonb(t) from public.%I t where source_website=$1 and source_id=$2 for update',rel) into target using w.key,r.source_id;
  if target is not null and target->>'store_id' is distinct from w.business_id::text then raise exception 'El directorio ya pertenece a otro establecimiento. Revisa la correspondencia.';end if;
  target_hash:=case when target is null then null else md5((target-array['updated_at','created_at'])::text) end;
  if entry.local_id is not null and target is not null then
   if entry.source_hash=source_hash then n:=n+1;continue;end if;
   if entry.target_hash<>target_hash then
    update private.totus_web_directory_projection set conflict=true,updated_at=now() where website_key=w.key and resource=p_resource and source_id=r.source_id;
    conflicts:=conflicts+1;continue;
   end if;
  elsif target is not null then raise exception 'Hay una identidad incorporada sin seguimiento. Revisa el directorio antes de continuar.';end if;
  local_id:=coalesce((target->>'id')::uuid,gen_random_uuid());
  proposed:=jsonb_build_object('id',local_id,'store_id',w.business_id,'source_website',w.key,'source_id',r.source_id,
   'name',case p_resource when 'customers' then btrim(concat_ws(' ',r.data->>'firstname',r.data->>'lastname')) else r.data->>'name' end,
   'email',coalesce(r.data->>'email',''),'phone',coalesce(nullif(main_address->>'phone_mobile',''),main_address->>'phone',''),
   'notes',coalesce(r.data->>'note',''),'details',jsonb_build_object('sourceData',r.data,'addresses',addresses,'company',coalesce(main_address->>'company','')));
  if btrim(coalesce(proposed->>'name',''))='' then raise exception 'El registro % de % no tiene nombre válido.',r.source_id,p_resource;end if;
  if p_resource='manufacturers' then
   insert into public.brands(id,store_id,source_website,source_id,name,email,phone,notes,details)
    values(local_id,w.business_id,w.key,r.source_id,proposed->>'name',proposed->>'email',proposed->>'phone',proposed->>'notes',proposed->'details')
    on conflict(id) do update set name=excluded.name,email=excluded.email,phone=excluded.phone,notes=excluded.notes,details=excluded.details;
  else
   proposed:=proposed||jsonb_build_object('tax_id',coalesce(nullif(main_address->>'vat_number',''),main_address->>'dni',''),
    'address',concat_ws(', ',nullif(main_address->>'address1',''),nullif(main_address->>'address2','')),
    'city',coalesce(main_address->>'city',''),'postal_code',coalesce(main_address->>'postcode',''),'province',coalesce(state_name,''),'country',coalesce(country_name,''),
    'active',case when r.data->>'active' in ('0','1') then r.data->>'active'='1' else true end);
   execute format('insert into public.%I(id,store_id,source_website,source_id,name,email,phone,notes,details,tax_id,address,city,postal_code,province,country,active)
    select x.id,x.store_id,x.source_website,x.source_id,x.name,x.email,x.phone,x.notes,x.details,x.tax_id,x.address,x.city,x.postal_code,x.province,x.country,x.active from jsonb_populate_record(null::public.%I,$1) x
    on conflict(id) do update set name=excluded.name,email=excluded.email,phone=excluded.phone,notes=excluded.notes,details=excluded.details,tax_id=excluded.tax_id,address=excluded.address,city=excluded.city,postal_code=excluded.postal_code,province=excluded.province,country=excluded.country,active=excluded.active,updated_at=now()',rel,rel) using proposed;
  end if;
  execute format('select to_jsonb(t) from public.%I t where id=$1',rel) into target using local_id;
  insert into private.totus_web_directory_projection(website_key,resource,source_id,local_id,source_hash,target_hash)
   values(w.key,p_resource,r.source_id,local_id,source_hash,md5((target-array['updated_at','created_at'])::text))
   on conflict(website_key,resource,source_id) do update set local_id=excluded.local_id,source_hash=excluded.source_hash,target_hash=excluded.target_hash,conflict=false,updated_at=now();
  n:=n+1;
 end loop;
 select count(*) into total from private.totus_web_source_records where website_key=w.key and resource=p_resource and source_id>last_id;
 return jsonb_build_object('resource',p_resource,'cursor',last_id,'processed',n,'conflicts',conflicts,'more',total>0,'storeId',w.business_id);
end $body$;
revoke all on function private.totus_web_directory_projection(text,text,bigint,boolean) from public,anon;
grant execute on function private.totus_web_directory_projection(text,text,bigint,boolean) to authenticated;
create or replace function public.totus_web_directory_projection(p_website text,p_resource text default null,p_cursor bigint default 0,p_apply boolean default false) returns jsonb language sql security invoker set search_path='' as $$select private.totus_web_directory_projection(p_website,p_resource,p_cursor,p_apply)$$;
revoke all on function public.totus_web_directory_projection(text,text,bigint,boolean) from public,anon;
grant execute on function public.totus_web_directory_projection(text,text,bigint,boolean) to authenticated;
commit;
