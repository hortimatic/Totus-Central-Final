-- Native returns: prepare through UI, confirm externally returned money, then atomically restock.
create table if not exists private.totus_tpv_local_refunds(
 id uuid primary key,sale_id uuid not null references private.totus_tpv_local_sales(id) on delete restrict,
 store_id uuid not null references public.ops_stores(id) on delete restrict,
 drawer_id uuid not null references public.ops_cash_drawers(id) on delete restrict,
 session_id uuid not null references private.totus_tpv_local_sessions(id) on delete restrict,
 actor_id uuid not null references public.profiles(id),status text not null check(status in('ready','confirmed','cancelled')),
 request jsonb not null,lines jsonb not null,payments jsonb not null,total_cents bigint not null check(total_cents>0),reason text not null,
 created_at timestamptz not null default now(),confirmed_at timestamptz);
alter table private.totus_tpv_local_refunds enable row level security;
revoke all on private.totus_tpv_local_refunds from public,anon,authenticated;
create index if not exists native_refunds_sale_idx on private.totus_tpv_local_refunds(sale_id);
create index if not exists native_refunds_store_idx on private.totus_tpv_local_refunds(store_id);
create index if not exists native_refunds_drawer_idx on private.totus_tpv_local_refunds(drawer_id);
create index if not exists native_refunds_session_idx on private.totus_tpv_local_refunds(session_id);
create or replace function public.totus_tpv_local_refund(p_drawer uuid,p_action text default 'list',p_sale uuid default null,p_id uuid default null,p_session uuid default null,p_data jsonb default '{}') returns jsonb language plpgsql security definer set search_path='' as $fn$
declare actor uuid:=totus_tpv_internal.local_authorize(p_drawer,'view');shop uuid;s private.totus_tpv_local_sales;r private.totus_tpv_local_refunds;line jsonb;entry jsonb;return_lines jsonb:='[]';refund_payments jsonb:='[]';left_lines jsonb:='[]';policy jsonb;qty numeric;prior_qty numeric;original_qty numeric;amount bigint;refund_total bigint:=0;total_prior bigint;remaining bigint;allocated bigint:=0;paid record;available bigint;restock boolean;result jsonb;intent jsonb;rest_item private.totus_tpv_local_catalogue;index_no int;
begin
 select store_id into shop from public.ops_cash_drawers where id=p_drawer;
 if p_action='list' then return jsonb_build_object('items',coalesce((select jsonb_agg(to_jsonb(x) order by x.created_at desc) from private.totus_tpv_local_refunds x where x.store_id=shop),'[]'));end if;
 if p_action in('get','confirm','cancel') then
  select * into r from private.totus_tpv_local_refunds where id=p_id and store_id=shop for update;
  if not found then raise exception 'La devolución no pertenece a esta tienda.';end if;
  p_sale:=r.sale_id;
 end if;
 select * into s from private.totus_tpv_local_sales where id=p_sale and store_id=shop for update;
 if not found then raise exception 'La venta no pertenece a esta tienda.';end if;
 if p_action='get' then return to_jsonb(r)||jsonb_build_object('totalCents',r.total_cents,'saleId',r.sale_id,'reference','D-'||left(r.id::text,8));end if;
 if p_action not in('returnable','prepare','confirm','cancel') then raise exception 'Acción de devolución inválida.';end if;
 perform totus_tpv_internal.local_authorize(p_drawer,'sell');
 if private.totus_can('ventas','edit') is not true then raise exception 'Necesitas permiso de edición de ventas para devolver.';end if;
 if p_action='confirm' and r.status='confirmed' then return to_jsonb(r)||jsonb_build_object('totalCents',r.total_cents,'saleId',r.sale_id,'reference','D-'||left(r.id::text,8));end if;
 if p_action='cancel' then
  if r.actor_id<>actor or r.status<>'ready' then raise exception 'Esta devolución ya no se puede cancelar.';end if;
  update private.totus_tpv_local_refunds set status='cancelled' where id=r.id;return jsonb_build_object('id',r.id,'status','cancelled');
 end if;
 if p_session is null or not exists(select 1 from private.totus_tpv_local_sessions where id=p_session and drawer_id=p_drawer and closed_at is null) then raise exception 'Necesitas una sesión abierta en la caja elegida.';end if;
 perform 1 from private.totus_tpv_local_sessions where id=p_session for update;
 select settings into policy from private.totus_tpv_owned_configuration where scope_id=p_drawer and section='returns';
 for line in select value from jsonb_array_elements(s.snapshot->'lines') loop
  select coalesce(sum((l->>'qty')::numeric),0) into prior_qty from private.totus_tpv_local_refunds x cross join lateral jsonb_array_elements(x.lines) l where x.sale_id=s.id and x.status='confirmed' and l->>'productId'=line->>'productId';
  left_lines:=left_lines||jsonb_build_array(line||jsonb_build_object('remainingQty',(line->>'qty')::numeric-prior_qty));
 end loop;
 if p_action='returnable' then return jsonb_build_object('saleId',s.id,'reference','Venta '||left(s.id::text,8),'lines',left_lines,'allowPartial',coalesce((policy->>'allowPartial')::boolean,true),'requireOriginalPayment',true,'availablePayments',coalesce((select jsonb_object_agg(payment_amounts.method,payment_amounts.amount) from (select p.method,sum(p.amount_cents) amount from private.totus_tpv_local_payments p where p.sale_id=s.id group by p.method) payment_amounts),'{}'));end if;
 if p_action='prepare' then
  if p_id is null or s.paid_cents<>s.total_cents or s.total_cents<=0 then raise exception 'Liquida el saldo pendiente antes de preparar el reintegro.';end if;
  intent:=jsonb_build_object('sale',s.id,'session',p_session,'data',p_data);
  select * into r from private.totus_tpv_local_refunds where id=p_id for update;
  if found then if r.actor_id<>actor or r.request<>intent then raise exception 'La solicitud tiene otros datos. Recupera la devolución existente.';end if;return to_jsonb(r)||jsonb_build_object('totalCents',r.total_cents,'saleId',r.sale_id,'reference','D-'||left(r.id::text,8));end if;
  if exists(select 1 from private.totus_tpv_local_refunds where sale_id=s.id and status='ready') then raise exception 'Recupera o cancela primero la devolución preparada de esta venta.';end if;
  if jsonb_typeof(p_data->'items') is distinct from 'array' or jsonb_array_length(p_data->'items') not between 1 and 100 or char_length(btrim(coalesce(p_data->>'reason',''))) not between 3 and 500 then raise exception 'Selecciona unidades y escribe el motivo de la devolución.';end if;
  if (select count(distinct x->>'productId') from jsonb_array_elements(p_data->'items') x)<>jsonb_array_length(p_data->'items') then raise exception 'Hay líneas repetidas.';end if;
  for entry in select value from jsonb_array_elements(p_data->'items') loop
   select l into line from jsonb_array_elements(left_lines) l where l->>'productId'=entry->>'productId';
   if line is null then raise exception 'El artículo no pertenece a esta venta.';end if;
   qty:=totus_tpv_internal.local_quantity(entry->'qty',coalesce(line->>'quantityUnit','unit'),false,999999999.999);
   if qty<=0 or qty>(line->>'remainingQty')::numeric or jsonb_typeof(entry->'restock') is distinct from 'boolean' then raise exception 'Las unidades superan las pendientes de devolver.';end if;
   prior_qty:=(line->>'qty')::numeric-(line->>'remainingQty')::numeric;original_qty:=(line->>'qty')::numeric;
   amount:=round((line->>'totalCents')::numeric*(prior_qty+qty)/original_qty)-round((line->>'totalCents')::numeric*prior_qty/original_qty);
   return_lines:=return_lines||jsonb_build_array(jsonb_build_object('productId',line->>'productId','name',line->>'name','reference',line->>'reference','qty',qty,'quantityUnit',line->>'quantityUnit','restock',(entry->>'restock')::boolean,'totalCents',amount));refund_total:=refund_total+amount;
  end loop;
  if coalesce((policy->>'allowPartial')::boolean,true) is false and exists(select 1 from jsonb_array_elements(left_lines) l where (l->>'remainingQty')::numeric>coalesce((select (x->>'qty')::numeric from jsonb_array_elements(p_data->'items') x where x->>'productId'=l->>'productId'),0)) then raise exception 'La configuración de esta caja exige devolver todas las unidades pendientes.';end if;
  if not exists(select 1 from jsonb_array_elements(left_lines) l where (l->>'remainingQty')::numeric>coalesce((select (x->>'qty')::numeric from jsonb_array_elements(p_data->'items') x where x->>'productId'=l->>'productId'),0)) then refund_total:=refund_total+coalesce((s.snapshot->>'feeCents')::bigint,0);end if;
  select coalesce(sum(total_cents),0) into total_prior from private.totus_tpv_local_refunds where sale_id=s.id and status='confirmed';
  if refund_total<=0 or refund_total>s.total_cents-total_prior then raise exception 'El importe no puede superar el saldo pendiente de devolución.';end if;
  for paid in select p.method,sum(p.amount_cents) amount from private.totus_tpv_local_payments p where p.sale_id=s.id group by p.method order by p.method loop
   select paid.amount-coalesce(sum((v->>'amountCents')::bigint),0) into available from private.totus_tpv_local_refunds f cross join lateral jsonb_array_elements(f.payments) v where f.sale_id=s.id and f.status='confirmed' and v->>'method'=paid.method;
   amount:=least(available,floor(refund_total::numeric*paid.amount/s.paid_cents)::bigint);allocated:=allocated+amount;
   refund_payments:=refund_payments||jsonb_build_array(jsonb_build_object('method',paid.method,'amountCents',amount,'available',available));
  end loop;
  remaining:=refund_total-allocated;
  for index_no in 0..jsonb_array_length(refund_payments)-1 loop
   amount:=least(remaining,(refund_payments->index_no->>'available')::bigint-(refund_payments->index_no->>'amountCents')::bigint);
   refund_payments:=jsonb_set(refund_payments,array[index_no::text,'amountCents'],to_jsonb((refund_payments->index_no->>'amountCents')::bigint+amount));remaining:=remaining-amount;
  end loop;
  if remaining<>0 then raise exception 'No se pudo repartir el reintegro entre los cobros originales.';end if;
  select jsonb_agg(v-'available') into refund_payments from jsonb_array_elements(refund_payments) v where (v->>'amountCents')::bigint>0;
  insert into private.totus_tpv_local_refunds(id,sale_id,store_id,drawer_id,session_id,actor_id,status,request,lines,payments,total_cents,reason) values(p_id,s.id,shop,p_drawer,p_session,actor,'ready',intent,return_lines,refund_payments,refund_total,btrim(p_data->>'reason')) returning * into r;
 else
  if r.status<>'ready' or r.actor_id<>actor or r.session_id<>p_session or r.drawer_id<>p_drawer or coalesce((p_data->>'confirmed')::boolean,false) is not true or (p_data->>'totalCents')::bigint is distinct from r.total_cents then raise exception 'Confirma el importe y el reintegro de esta devolución preparada.';end if;
  for entry in select value from jsonb_array_elements(r.lines) where (value->>'restock')::boolean order by value->>'productId' loop
   select * into rest_item from private.totus_tpv_local_catalogue where store_id=shop and id=(entry->>'productId')::uuid for update;
   if not found then raise exception 'No se puede reponer: el artículo ya no está en el catálogo de esta tienda.';end if;
   update private.totus_tpv_local_catalogue set stock=stock+(entry->>'qty')::numeric,revision=revision+1 where store_id=shop and id=rest_item.id;
  end loop;
  update private.totus_tpv_local_refunds set status='confirmed',confirmed_at=now() where id=r.id returning * into r;
 end if;
 return to_jsonb(r)||jsonb_build_object('totalCents',r.total_cents,'saleId',r.sale_id,'reference','D-'||left(r.id::text,8));
end $fn$;
revoke all on function public.totus_tpv_local_refund(uuid,text,uuid,uuid,uuid,jsonb) from public,anon;
grant execute on function public.totus_tpv_local_refund(uuid,text,uuid,uuid,uuid,jsonb) to authenticated;

create or replace function private.totus_native_pending_refunds() returns trigger language plpgsql set search_path='' as $$
begin
 if old.closed_at is null and new.closed_at is not null and exists(select 1 from private.totus_tpv_local_refunds where session_id=new.id and status='ready') then raise exception 'Confirma o cancela las devoluciones preparadas antes de cerrar la caja.';end if;
 return new;
end $$;
revoke all on function private.totus_native_pending_refunds() from public,anon,authenticated;
drop trigger if exists native_pending_refunds on private.totus_tpv_local_sessions;
create trigger native_pending_refunds before update on private.totus_tpv_local_sessions for each row execute function private.totus_native_pending_refunds();

CREATE OR REPLACE FUNCTION totus_tpv_internal.local_summary(p_session uuid, p_internal boolean DEFAULT false)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare s private.totus_tpv_local_sessions;cash bigint;incoming bigint;outgoing bigint;totals jsonb;expected bigint;hidden boolean;refund_totals jsonb;refund_cash bigint;
begin
 select * into s from private.totus_tpv_local_sessions where id=p_session;
 select coalesce(sum(amount_cents),0) into cash from private.totus_tpv_local_payments where session_id=p_session and method='cash';
 select coalesce(sum(amount_cents)filter(where kind='in'),0),coalesce(sum(amount_cents)filter(where kind='out'),0) into incoming,outgoing from private.totus_tpv_local_cash_moves where session_id=p_session;
 select coalesce(jsonb_object_agg(method,total),'{}') into totals from (select method,sum(amount_cents) total from private.totus_tpv_local_payments where session_id=p_session group by method)x;
 select coalesce(jsonb_object_agg(method,total),'{}') into refund_totals from (select p->>'method' method,sum((p->>'amountCents')::bigint) total from private.totus_tpv_local_refunds f cross join lateral jsonb_array_elements(f.payments) p where f.session_id=p_session and f.status='confirmed' group by p->>'method') x;
 refund_cash:=coalesce((refund_totals->>'cash')::bigint,0);
 expected:=s.opening_cents+cash+incoming-outgoing-refund_cash;
 select coalesce((cash_setup->>'hideSummary')::boolean,false) into hidden from private.totus_tpv_general_templates where drawer_id=s.drawer_id;
 hidden:=coalesce(hidden,false) and private.totus_can('configuracion','edit') is not true and not p_internal;
 if s.closing_snapshot is not null then return s.closing_snapshot||case when hidden then jsonb_build_object('cashSummaryHidden',true,'expectedCashCents',null,'differenceCents',null) else '{}'::jsonb end;end if;
 return jsonb_build_object('sessionId',s.id,'storeId',s.store_id,'drawerId',s.drawer_id,'openingCents',s.opening_cents,'salesCents',coalesce((select sum(total_cents) from private.totus_tpv_local_sales where session_id=p_session),0),'collectedCents',coalesce((select sum(amount_cents) from private.totus_tpv_local_payments where session_id=p_session),0),'outstandingCents',coalesce((select sum(total_cents-paid_cents) from private.totus_tpv_local_sales where session_id=p_session),0),'paymentTotals',totals,'refundTotals',refund_totals,'refundCashCents',refund_cash,'refundCents',coalesce((select sum(total_cents) from private.totus_tpv_local_refunds where session_id=p_session and status='confirmed'),0),'unresolved',(select count(*) from private.totus_tpv_local_refunds where session_id=p_session and status='ready'),'inCents',incoming,'outCents',outgoing,'cashSummaryHidden',hidden,'expectedCashCents',case when hidden then null else expected end,'closedAt',s.closed_at,'countedCents',s.counted_cents,'differenceCents',case when hidden then null else s.counted_cents-expected end);
end $function$;


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
