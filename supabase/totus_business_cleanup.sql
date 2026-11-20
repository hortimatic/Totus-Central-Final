-- Administrative deletion is invoked only by the visible preview/confirmation flow.
create or replace function private.totus_business_cleanup_plan(p_store uuid,p_drawer uuid,p_groups text[],p_remove boolean) returns jsonb language plpgsql set search_path='' as $fn$
declare t record;f record;condition text;matching bigint;changed bigint;pass integer:=0;group_name text;store_name text;store_code text;summary jsonb;fingerprint text;
begin
 select name,code into store_name,store_code from public.ops_stores where id=p_store for update;
 if store_name is null then raise exception 'El establecimiento ya no existe.';end if;
 if p_drawer is not null and not exists(select 1 from public.ops_cash_drawers where id=p_drawer and store_id=p_store) then raise exception 'La caja no pertenece a este establecimiento.';end if;
 if p_groups is null or cardinality(p_groups)=0 or not(p_groups<@array['catalogue','contacts','activity','documents','configuration','connections','tasks']) then raise exception 'Selecciona los datos que deseas retirar.';end if;
 if p_remove and p_drawer is null and not(array['catalogue','contacts','activity','documents','configuration','connections','tasks']<@p_groups) then raise exception 'Para eliminar el establecimiento completo debes incluir todos los grupos.';end if;
 drop table if exists pg_temp.totus_business_cleanup_rows;
 create temporary table totus_business_cleanup_rows(rel oid not null,key text not null,data jsonb not null,depth integer not null default 0,processed boolean not null default false,primary key(rel,key)) on commit drop;
 if p_remove then
  if p_drawer is null then insert into pg_temp.totus_business_cleanup_rows(rel,key,data) select 'public.ops_stores'::regclass,md5(to_jsonb(s)::text),to_jsonb(s) from public.ops_stores s where id=p_store;
  else insert into pg_temp.totus_business_cleanup_rows(rel,key,data) select 'public.ops_cash_drawers'::regclass,md5(to_jsonb(d)::text),to_jsonb(d) from public.ops_cash_drawers d where id=p_drawer;end if;
 end if;
 for t in select distinct c.oid,n.nspname,c.relname,a.attname from pg_class c join pg_namespace n on n.oid=c.relnamespace join pg_attribute a on a.attrelid=c.oid and not a.attisdropped where c.relkind='r' and n.nspname in('public','private') and a.attname=case when p_drawer is null then 'store_id' else 'drawer_id' end and c.relname not in('profiles','team_members','ops_roles','ops_role_permissions','ops_user_permissions') loop
  group_name:=case when t.relname ~ '(catalogue|stock|product)' then 'catalogue' when t.relname ~ '(customer|directory)' then 'contacts' when t.relname ~ '(document|invoice|expense|fiscal|income|tax_payment)' then 'documents' when t.relname ~ '(task|chat)' then 'tasks' when t.relname ~ '(session|sale|payment|quote|draft|cash_move|daily_clos)' or t.relname='ops_cash_drawers' then 'activity' else 'configuration' end;
  if group_name=any(p_groups) then execute format('insert into pg_temp.totus_business_cleanup_rows(rel,key,data) select %s,md5(to_jsonb(r)::text),to_jsonb(r) from %I.%I r where %I=$1 on conflict do nothing',t.oid,t.nspname,t.relname,t.attname) using coalesce(p_drawer,p_store);end if;
 end loop;
 if p_drawer is null and 'connections'=any(p_groups) then
  insert into pg_temp.totus_business_cleanup_rows(rel,key,data) select 'private.totus_websites'::regclass,md5(to_jsonb(w)::text),to_jsonb(w) from private.totus_websites w where business_id=p_store on conflict do nothing;
  insert into pg_temp.totus_business_cleanup_rows(rel,key,data) select 'private.totus_api_connections'::regclass,md5(to_jsonb(c)::text),to_jsonb(c) from private.totus_api_connections c where exists(select 1 from private.totus_websites w where w.connection_id=c.id and w.business_id=p_store) and not exists(select 1 from private.totus_websites w where w.connection_id=c.id and w.business_id is distinct from p_store) and not exists(select 1 from private.totus_tpv_assignments a where a.connection_id=c.id and a.store_id<>p_store) and not exists(select 1 from private.totus_tpv_native_profiles a where a.connection_id=c.id and a.store_id<>p_store) on conflict do nothing;
 end if;
 if p_drawer is null and 'catalogue'=any(p_groups) then
  insert into pg_temp.totus_business_cleanup_rows(rel,key,data) select 'public.products'::regclass,md5(to_jsonb(p)::text),to_jsonb(p) from public.products p where exists(select 1 from private.totus_tpv_local_catalogue c where c.product_id=p.id and c.store_id=p_store) and not exists(select 1 from private.totus_tpv_local_catalogue c where c.product_id=p.id and c.store_id<>p_store) on conflict do nothing;
  insert into pg_temp.totus_business_cleanup_rows(rel,key,data) select 'public.families'::regclass,md5(to_jsonb(f)::text),to_jsonb(f) from public.families f where exists(select 1 from pg_temp.totus_business_cleanup_rows r where r.rel='public.products'::regclass and r.data->>'family_id'=f.id::text) and not exists(select 1 from public.products p where p.family_id=f.id and not exists(select 1 from pg_temp.totus_business_cleanup_rows r where r.rel='public.products'::regclass and r.data->>'id'=p.id::text)) on conflict do nothing;
  insert into pg_temp.totus_business_cleanup_rows(rel,key,data) select 'public.brands'::regclass,md5(to_jsonb(b)::text),to_jsonb(b) from public.brands b where exists(select 1 from pg_temp.totus_business_cleanup_rows r where r.rel='public.families'::regclass and r.data->>'brand_id'=b.id::text) and not exists(select 1 from public.families f where f.brand_id=b.id and not exists(select 1 from pg_temp.totus_business_cleanup_rows r where r.rel='public.families'::regclass and r.data->>'id'=f.id::text)) on conflict do nothing;
 end if;
 if p_drawer is null and 'contacts'=any(p_groups) then
  insert into pg_temp.totus_business_cleanup_rows(rel,key,data) select 'public.ops_customers'::regclass,md5(to_jsonb(c)::text),to_jsonb(c) from public.ops_customers c where exists(select 1 from private.totus_tpv_local_sales s where s.store_id=p_store and s.customer_id=c.id) and not exists(select 1 from private.totus_tpv_local_sales s where s.store_id<>p_store and s.customer_id=c.id) and not exists(select 1 from public.ops_sales_invoices i where i.store_id is distinct from p_store and i.customer_id=c.id) on conflict do nothing;
 end if;
 loop
  changed:=0;pass:=pass+1;if pass>64 then raise exception 'Hay dependencias circulares que requieren revisión. No se ha eliminado ningún dato.';end if;
  for f in select k.*,n.nspname,child.relname,parent.oid parent_oid,pn.nspname parent_schema,parent.relname parent_name from pg_constraint k join pg_class child on child.oid=k.conrelid join pg_namespace n on n.oid=child.relnamespace join pg_class parent on parent.oid=k.confrelid join pg_namespace pn on pn.oid=parent.relnamespace where k.contype='f' and n.nspname in('public','private','totus_tpv_internal') and exists(select 1 from pg_temp.totus_business_cleanup_rows r where r.rel=k.confrelid) loop
   select string_agg(format('c.%I=p.%I',ca.attname,pa.attname),' and ' order by x.ord) into condition from unnest(f.conkey,f.confkey) with ordinality x(ca_num,pa_num,ord) join pg_attribute ca on ca.attrelid=f.conrelid and ca.attnum=x.ca_num join pg_attribute pa on pa.attrelid=f.confrelid and pa.attnum=x.pa_num;
   execute format('insert into pg_temp.totus_business_cleanup_rows as target(rel,key,data,depth) select %s,md5(to_jsonb(c)::text),to_jsonb(c),max(r.depth)+1 from pg_temp.totus_business_cleanup_rows r cross join lateral jsonb_populate_record(null::%I.%I,r.data) p join %I.%I c on %s where r.rel=%s and (%L<>''n'' or exists(select 1 from pg_temp.totus_business_cleanup_rows known where known.rel=%s and known.key=md5(to_jsonb(c)::text))) group by to_jsonb(c) on conflict(rel,key) do update set depth=excluded.depth where target.depth<excluded.depth',f.conrelid,f.parent_schema,f.parent_name,f.nspname,f.relname,condition,f.confrelid,f.confdeltype,f.conrelid);
   get diagnostics matching=row_count;changed:=changed+matching;
  end loop;
  exit when changed=0;
 end loop;
 select md5(coalesce(string_agg(rel::text||':'||key,',' order by rel,key),'')) into fingerprint from pg_temp.totus_business_cleanup_rows;
 select coalesce(jsonb_agg(jsonb_build_object('table',table_name,'count',records) order by table_name),'[]') into summary from(select (rel::regclass)::text table_name,count(*) records from pg_temp.totus_business_cleanup_rows group by rel)x;
 return jsonb_build_object('storeId',p_store,'storeName',store_name,'storeCode',store_code,'drawerId',p_drawer,'fingerprint',fingerprint,'tables',summary,'total',(select count(*) from pg_temp.totus_business_cleanup_rows),'requiresClosing',exists(select 1 from private.totus_tpv_local_sessions where store_id=p_store and (p_drawer is null or drawer_id=p_drawer) and closed_at is null),'hasFiles',exists(select 1 from pg_temp.totus_business_cleanup_rows where rel='public.ops_documents'::regclass and coalesce(data->>'storage_path',data->>'file_path',data->>'onedrive_item_id','')<>''));
end $fn$;
revoke all on function private.totus_business_cleanup_plan(uuid,uuid,text[],boolean) from public,anon,authenticated;

create or replace function public.totus_business_cleanup(p_store uuid,p_drawer uuid default null,p_groups text[] default array['catalogue','contacts','activity','documents','configuration','connections','tasks'],p_remove boolean default true,p_execute boolean default false,p_fingerprint text default null,p_confirmation text default null) returns jsonb language plpgsql security definer set search_path='' as $fn$
declare actor uuid:=auth.uid();plan jsonb;t record;key_condition text;removed bigint;total_removed bigint:=0;connection_id text;
begin
 if actor is null or not exists(select 1 from public.profiles where id=actor and active and role='admin') or private.totus_can('administracion','edit') is not true then raise exception 'Solo un administrador puede limpiar o eliminar establecimientos.';end if;
 perform pg_advisory_xact_lock(hashtextextended('business-cleanup:'||p_store::text,0));
 if p_remove is null or p_execute is null then raise exception 'Selecciona una operación válida.';end if;
 plan:=private.totus_business_cleanup_plan(p_store,p_drawer,p_groups,p_remove);
 if not p_execute then return plan;end if;
 if p_fingerprint is distinct from plan->>'fingerprint' then raise exception 'Los datos han cambiado. Vuelve a revisar el resumen antes de confirmar.';end if;
 if p_confirmation is distinct from ('ELIMINAR '||(plan->>'storeCode')) then raise exception 'Escribe la confirmación completa indicada en pantalla.';end if;
 if (plan->>'requiresClosing')::boolean then raise exception 'Cierra las cajas abiertas desde el TPV antes de continuar.';end if;
 if (plan->>'hasFiles')::boolean then raise exception 'Retira primero los archivos vinculados desde Documentos para no dejar archivos huérfanos.';end if;
 for t in select rel,max(depth) depth from pg_temp.totus_business_cleanup_rows group by rel order by max(depth) desc,rel loop
  select string_agg(format('t.%I is not distinct from original.%I',a.attname,a.attname),' and ' order by x.ord) into key_condition from pg_constraint k cross join lateral unnest(k.conkey) with ordinality x(attnum,ord) join pg_attribute a on a.attrelid=k.conrelid and a.attnum=x.attnum where k.conrelid=t.rel and k.contype='p';
  execute format('select 1 from %s t join pg_temp.totus_business_cleanup_rows p on p.rel=%s cross join lateral jsonb_populate_record(null::%s,p.data) original where %s for update of t',t.rel::regclass,t.rel,t.rel::regclass,coalesce(key_condition,'to_jsonb(t)=p.data'));
 end loop;
 plan:=private.totus_business_cleanup_plan(p_store,p_drawer,p_groups,p_remove);
 if p_fingerprint is distinct from plan->>'fingerprint' then raise exception 'Los datos han cambiado durante la revisión. Actualiza el resumen.';end if;
 for connection_id in select data->>'id' from pg_temp.totus_business_cleanup_rows where rel='private.totus_api_connections'::regclass loop delete from vault.secrets where name='totus_api_'||connection_id;end loop;
 for t in select rel,max(depth) depth from pg_temp.totus_business_cleanup_rows group by rel order by max(depth) desc,rel loop
  select string_agg(format('t.%I is not distinct from original.%I',a.attname,a.attname),' and ' order by x.ord) into key_condition from pg_constraint k cross join lateral unnest(k.conkey) with ordinality x(attnum,ord) join pg_attribute a on a.attrelid=k.conrelid and a.attnum=x.attnum where k.conrelid=t.rel and k.contype='p';
  execute format('delete from %s t using pg_temp.totus_business_cleanup_rows p cross join lateral jsonb_populate_record(null::%s,p.data) original where p.rel=%s and %s',t.rel::regclass,t.rel::regclass,t.rel,coalesce(key_condition,'to_jsonb(t)=p.data'));get diagnostics removed=row_count;total_removed:=total_removed+removed;
 end loop;
 delete from private.totus_tpv_local_audit a where exists(select 1 from pg_temp.totus_business_cleanup_rows r where r.data->>'id'=a.record_id::text) or (p_remove and p_drawer is null and (a.previous->>'store_id'=p_store::text or a.current->>'store_id'=p_store::text));
 delete from public.ops_audit_log a where exists(select 1 from pg_temp.totus_business_cleanup_rows r where r.data?'id' and position(r.data->>'id' in a.detail::text)>0);
 if p_remove and p_drawer is null and exists(select 1 from public.ops_stores where id=p_store) then raise exception 'No se ha podido retirar el establecimiento. La operación se ha revertido.';end if;
 if p_remove and p_drawer is not null and exists(select 1 from public.ops_cash_drawers where id=p_drawer) then raise exception 'No se ha podido retirar la caja. La operación se ha revertido.';end if;
 return jsonb_build_object('removed',total_removed,'storeRemoved',p_remove and p_drawer is null,'drawerRemoved',p_remove and p_drawer is not null);
end $fn$;
revoke all on function public.totus_business_cleanup(uuid,uuid,text[],boolean,boolean,text,text) from public,anon;
grant execute on function public.totus_business_cleanup(uuid,uuid,text[],boolean,boolean,text,text) to authenticated;
