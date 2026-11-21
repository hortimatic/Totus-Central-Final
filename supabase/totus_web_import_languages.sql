-- Technical import snapshot only; installing this creates no shop/catalogue data.
begin;
alter table private.totus_web_import_jobs add column if not exists language_context jsonb;
create or replace function public.totus_web_import_language_context(p_job uuid,p_actor uuid,p_context jsonb) returns jsonb
language plpgsql security definer set search_path='' as $$
declare job private.totus_web_import_jobs;website private.totus_websites;connection private.totus_api_connections;primary_id text;
begin
 if p_actor is null or not exists(select 1 from public.profiles where id=p_actor and active) then raise exception 'Necesitas una sesión activa.';end if;
 select * into strict job from private.totus_web_import_jobs where id=p_job for update;
 select * into strict website from private.totus_websites where key=job.website_key;
 select * into strict connection from private.totus_api_connections where id=website.connection_id;
 if job.actor_id<>p_actor or job.state<>'running' or website.status<>'active' or not connection.enabled or not connection.real_data_authorized or connection.verified_revision is distinct from connection.revision or job.connection_revision<>connection.revision then raise exception 'La importación o su conexión han cambiado.';end if;
 if jsonb_typeof(p_context) is distinct from 'object' or p_context-array['languages','primaryLanguageId','source']<>'{}' or not(p_context?&array['languages','primaryLanguageId','source']) or octet_length(p_context::text)>1048576 or p_context->>'source' not in('connector-profile','single-active-language') or jsonb_typeof(p_context->'languages') is distinct from 'array' or jsonb_array_length(p_context->'languages')<1 then raise exception 'Inventario de idiomas no válido.';end if;
 primary_id:=p_context->>'primaryLanguageId';
 if primary_id!~'^[1-9][0-9]{0,14}$' or exists(select 1 from jsonb_array_elements(p_context->'languages') x where x->>'id'!~'^[1-9][0-9]{0,14}$' or not(x?&array['id','name','isoCode','active']) or jsonb_typeof(x->'name')<>'string' or length(x->>'name')>128 or x->>'isoCode'!~*'^[a-z]{2,3}(-[a-z0-9]{2,8})?$' or jsonb_typeof(x->'active')<>'boolean') or (select count(*)<>count(distinct x->>'id') from jsonb_array_elements(p_context->'languages') x) or not exists(select 1 from jsonb_array_elements(p_context->'languages') x where x->>'id'=primary_id and x->>'active'='true') then raise exception 'Falta identificar el idioma principal activo.';end if;
 if job.language_context is not null then if job.language_context<>p_context then raise exception 'Los idiomas cambiaron durante la importación. Inicia una nueva lectura.';end if;return job.language_context;end if;
 update private.totus_web_import_jobs set language_context=p_context where id=p_job;
 return p_context;
end $$;
revoke all on function public.totus_web_import_language_context(uuid,uuid,jsonb) from public,anon,authenticated;
grant execute on function public.totus_web_import_language_context(uuid,uuid,jsonb) to service_role;
commit;
