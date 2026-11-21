-- Installed code only. Disconnection is performed exclusively by the UI RPC.
begin;
alter table private.totus_api_connections add column if not exists disconnected_at timestamptz;
create or replace function private.totus_web_connection_lifecycle(p_action text,p_id uuid,p_expected_revision bigint) returns jsonb
language plpgsql security definer set search_path='' as $body$
declare c private.totus_api_connections; w private.totus_websites;
begin
 if auth.uid() is null then raise exception 'Inicia sesión.';end if;
 perform private.totus_api_admin();
 if p_action not in ('disconnect','reconnect') then raise exception 'Acción de conexión no válida.';end if;
 perform pg_advisory_xact_lock(hashtextextended('totus_api_manager',0));
 select * into strict c from private.totus_api_connections where id=p_id for update;
 if c.protocol<>'prestashop' then raise exception 'Selecciona una conexión de tienda.';end if;
 if c.revision is distinct from p_expected_revision then raise exception 'La conexión ha cambiado. Actualiza antes de continuar.';end if;
 select * into strict w from private.totus_websites where connection_id=c.id for update;
 if w.business_id is not null and private.totus_local_store_access(w.business_id) is not true then raise exception 'No tienes acceso al establecimiento.';end if;
 perform pg_advisory_xact_lock(hashtextextended('web-products:'||w.key,0));
 perform pg_advisory_xact_lock(hashtextextended('web-import:'||w.key,0));
 if exists(select 1 from private.totus_web_import_jobs where website_key=w.key and state='running') or
    exists(select 1 from private.totus_web_native_catalogue_jobs where website_key=w.key and state='running') then
  raise exception 'Pausa o termina la importación y la preparación de precios antes de desconectar.';
 end if;
 if p_action='disconnect' then
  -- Keep identity and historical FKs, but remove all usable credentials and destinations.
  delete from vault.secrets where name='totus_api_'||c.id;
  update private.totus_api_connections set enabled=false,disconnected_at=clock_timestamp(),
   verified_revision=null,verified_at=null,revision=revision+1,updated_at=clock_timestamp() where id=c.id;
  update private.totus_websites set status='retired',include_in_totals=false,
   revision=revision+1,updated_at=clock_timestamp() where key=w.key;
 else
  if c.disconnected_at is null then raise exception 'La conexión no está desconectada.';end if;
  if c.verified_revision is distinct from c.revision or not c.free_confirmed or not c.real_data_authorized or
     not exists(select 1 from vault.secrets where name='totus_api_'||c.id) then
   raise exception 'Configura la clave, guarda y prueba la API antes de reconectar.';
  end if;
  update private.totus_api_connections set enabled=true,disconnected_at=null,updated_at=clock_timestamp() where id=c.id;
  update private.totus_websites set status='active',include_in_totals=false,
   revision=revision+1,updated_at=clock_timestamp() where key=w.key;
 end if;
 insert into public.ops_audit_log(user_id,user_email,area,action,detail)
 values(auth.uid(),lower(auth.jwt()->>'email'),'administracion','website_'||p_action,
  jsonb_build_object('connection_id',c.id,'website_key',w.key,'retainedData',true));
 return private.totus_api_manager('list','{}',null);
end $body$;
revoke all on function private.totus_web_connection_lifecycle(text,uuid,bigint) from public,anon;
grant execute on function private.totus_web_connection_lifecycle(text,uuid,bigint) to authenticated;
create or replace function public.totus_web_connection_lifecycle(p_action text,p_id uuid,p_expected_revision bigint) returns jsonb
language sql security invoker set search_path='' as $$select private.totus_web_connection_lifecycle(p_action,p_id,p_expected_revision)$$;
revoke all on function public.totus_web_connection_lifecycle(text,uuid,bigint) from public,anon;
grant execute on function public.totus_web_connection_lifecycle(text,uuid,bigint) to authenticated;
create or replace function private.totus_web_connection_guard() returns trigger
language plpgsql security definer set search_path='' as $$
begin
 if new.enabled and new.disconnected_at is not null then
  raise exception 'Configura, prueba y usa Reconectar para esta tienda.';
 end if;
 if old.protocol='prestashop' and exists(select 1 from private.totus_websites where connection_id=old.id) and
    (new.protocol<>'prestashop' or rtrim(new.endpoint,'/')<>rtrim(old.endpoint,'/')) then
  raise exception 'La dirección pertenece a la identidad de esta web. Crea otra conexión para una web diferente.';
 end if;
 return new;
end $$;
revoke all on function private.totus_web_connection_guard() from public,anon,authenticated;
drop trigger if exists totus_web_connection_guard on private.totus_api_connections;
create trigger totus_web_connection_guard before update of enabled,disconnected_at,endpoint,protocol
on private.totus_api_connections for each row execute function private.totus_web_connection_guard();
commit;
