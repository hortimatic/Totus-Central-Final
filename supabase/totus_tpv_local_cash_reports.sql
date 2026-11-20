create or replace function totus_tpv_internal.local_cash_report_session(p_session uuid) returns jsonb language sql stable set search_path='' as $fn$
 select totus_tpv_internal.local_summary(s.id,false)||jsonb_build_object(
 'environment','central','currency','EUR','status',case when s.closed_at is null then 'open' else 'closed' end,
 'sessionId',s.id,'storeId',s.store_id,'drawerId',s.drawer_id,'storeName',st.name,'drawerName',d.name,
 'openedAt',s.opened_at,'openedByName',coalesce(op.full_name,'Usuario de Central'),'closedAt',s.closed_at,'closedByName',cl.full_name,
 'payments',coalesce(totus_tpv_internal.local_summary(s.id,false)->'paymentTotals','{}'::jsonb),'refunds',coalesce(totus_tpv_internal.local_summary(s.id,false)->'refundTotals','{}'::jsonb),
 'cashInCents',(totus_tpv_internal.local_summary(s.id,false)->>'inCents')::bigint,'cashOutCents',(totus_tpv_internal.local_summary(s.id,false)->>'outCents')::bigint,
 'orderCount',(select count(*) from private.totus_tpv_local_sales x where x.session_id=s.id),'refundCount',(select count(*) from private.totus_tpv_local_refunds x where x.session_id=s.id and x.status='confirmed'),
 'movementCount',(select count(*) from private.totus_tpv_local_cash_moves x where x.session_id=s.id),'unresolvedSales',0,'pendingRefunds',(select count(*) from private.totus_tpv_local_refunds x where x.session_id=s.id and x.status='ready'))
 from private.totus_tpv_local_sessions s join public.ops_stores st on st.id=s.store_id join public.ops_cash_drawers d on d.id=s.drawer_id left join public.profiles op on op.id=s.opened_by left join public.profiles cl on cl.id=s.closed_by where s.id=p_session;
$fn$;
revoke all on function totus_tpv_internal.local_cash_report_session(uuid) from public,anon,authenticated;

create or replace function public.totus_tpv_local_cash_report(p_selection jsonb default '{}',p_section text default 'context',p_query jsonb default '{}') returns jsonb language plpgsql security definer set search_path='' as $fn$
declare ctx jsonb;allowed uuid[];store uuid;drawer uuid;sid uuid;lim integer:=20;result jsonb;more boolean;lastrow jsonb;needle text;since date;until date;cursor_time timestamptz;cursor_id uuid;
begin
 if auth.uid() is null or private.totus_can('cajas','view') is not true then raise exception 'No tienes permiso para consultar Cajas.';end if;
 ctx:=public.totus_tpv_local_context();
 if p_section='context' then
  return jsonb_build_object('environment','central','sources',coalesce((select jsonb_agg(jsonb_build_object('mode','central','storeId',store_id,'storeName',store_name,'storeActive',true,'currency','EUR','drawers',drawers) order by store_name) from (select item->>'storeId' store_id,min(item->>'storeName') store_name,jsonb_agg(jsonb_build_object('id',item->>'id','name',item->>'name','active',true) order by item->>'name') drawers from jsonb_array_elements(ctx->'drawers') item group by item->>'storeId') grouped),'[]'::jsonb));
 end if;
 if p_section not in('sessions','session','sales','refunds','movements') or jsonb_typeof(p_selection) is distinct from 'object' or jsonb_typeof(p_query) is distinct from 'object' then raise exception 'Consulta de caja no válida.';end if;
 store:=(p_selection->>'storeId')::uuid;drawer:=(p_selection->>'drawerId')::uuid;sid:=(p_selection->>'sessionId')::uuid;
 select array_agg((item->>'id')::uuid) into allowed from jsonb_array_elements(ctx->'drawers') item where (item->>'storeId')::uuid=store and (drawer is null or (item->>'id')::uuid=drawer);
 if coalesce(cardinality(allowed),0)=0 then raise exception 'No tienes acceso a las cajas del establecimiento.';end if;
 lim:=coalesce((p_query->>'limit')::integer,20);needle:=coalesce(p_query->>'search','');since:=(p_query->>'from')::date;until:=(p_query->>'to')::date;
 if lim not between 1 and 200 or char_length(needle)>100 or coalesce(p_query->>'status','all') not in('all','open','closed') then raise exception 'Filtros de caja no válidos.';end if;
 cursor_time:=(p_query#>>'{cursor,recordedAt}')::timestamptz;cursor_id:=(p_query#>>'{cursor,id}')::uuid;
 if p_section='sessions' then
  select coalesce(jsonb_agg(totus_tpv_internal.local_cash_report_session(x.id) order by x.opened_at desc,x.id desc),'[]') into result from (select s.* from private.totus_tpv_local_sessions s join public.ops_cash_drawers d on d.id=s.drawer_id left join public.profiles op on op.id=s.opened_by where s.store_id=store and s.drawer_id=any(allowed) and (coalesce(p_query->>'status','all')='all' or (p_query->>'status'='open' and s.closed_at is null) or (p_query->>'status'='closed' and s.closed_at is not null)) and (since is null or (s.opened_at at time zone 'Europe/Madrid')::date>=since) and (until is null or (s.opened_at at time zone 'Europe/Madrid')::date<=until) and (needle='' or position(lower(needle) in lower(d.name||' '||coalesce(op.full_name,'')))>0) and (cursor_time is null or (s.opened_at,s.id)<(cursor_time,cursor_id)) order by s.opened_at desc,s.id desc limit lim+1)x;
 else
  if not exists(select 1 from private.totus_tpv_local_sessions where id=sid and store_id=store and drawer_id=any(allowed)) then raise exception 'La sesión no pertenece a tus cajas autorizadas.';end if;
  if p_section='session' then return totus_tpv_internal.local_cash_report_session(sid);end if;
  if p_section='sales' then
   select coalesce(jsonb_agg(jsonb_build_object('id',x.id,'saleId',x.id,'reference',x.id::text,'orderId',null,'status','confirmed','totalCents',x.total_cents,'actorName',x.actor_name,'recordedAt',x.created_at) order by x.created_at desc,x.id desc),'[]') into result from (select s.*,op.full_name actor_name from private.totus_tpv_local_sales s left join public.profiles op on op.id=s.actor_id where s.session_id=sid and (needle='' or position(lower(needle) in lower(s.id::text))>0) and (cursor_time is null or (s.created_at,s.id)<(cursor_time,cursor_id)) order by s.created_at desc,s.id desc limit lim+1)x;
  elsif p_section='movements' then
   select coalesce(jsonb_agg(jsonb_build_object('id',x.id,'kind',case when x.kind='in' then 'cash-in' else 'cash-out' end,'amountCents',x.amount_cents,'reason',x.note,'actorName',x.actor_name,'recordedAt',x.created_at) order by x.created_at desc,x.id desc),'[]') into result from (select m.*,op.full_name actor_name from private.totus_tpv_local_cash_moves m left join public.profiles op on op.id=m.actor_id where m.session_id=sid and (needle='' or position(lower(needle) in lower(coalesce(m.note,'')))>0) and (cursor_time is null or (m.created_at,m.id)<(cursor_time,cursor_id)) order by m.created_at desc,m.id desc limit lim+1)x;
  else select coalesce(jsonb_agg(jsonb_build_object('id',x.id,'saleId',x.sale_id,'reference','D-'||left(x.id::text,8),'status',x.status,'totalCents',x.total_cents,'actorName',x.actor_name,'recordedAt',x.created_at) order by x.created_at desc,x.id desc),'[]') into result from (select f.*,op.full_name actor_name from private.totus_tpv_local_refunds f left join public.profiles op on op.id=f.actor_id where f.session_id=sid and (cursor_time is null or (f.created_at,f.id)<(cursor_time,cursor_id)) order by f.created_at desc,f.id desc limit lim+1)x;end if;
 end if;
 more:=jsonb_array_length(result)>lim;select coalesce(jsonb_agg(value order by ord),'[]') into result from jsonb_array_elements(result) with ordinality e(value,ord) where ord<=lim;lastrow:=result->(jsonb_array_length(result)-1);
 return jsonb_build_object('items',result,'hasMore',more,'cursor',case when more then jsonb_build_object('id',coalesce(lastrow->>'sessionId',lastrow->>'id'),'recordedAt',coalesce(lastrow->>'openedAt',lastrow->>'recordedAt')) else null end);
end $fn$;
revoke all on function public.totus_tpv_local_cash_report(jsonb,text,jsonb) from public,anon;
grant execute on function public.totus_tpv_local_cash_report(jsonb,text,jsonb) to authenticated;
