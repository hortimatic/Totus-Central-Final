begin;
set local lock_timeout='5s';
CREATE OR REPLACE FUNCTION public.totus_tpv_local_refund(p_drawer uuid, p_action text DEFAULT 'list'::text, p_sale uuid DEFAULT NULL::uuid, p_id uuid DEFAULT NULL::uuid, p_session uuid DEFAULT NULL::uuid, p_data jsonb DEFAULT '{}'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare actor uuid:=totus_tpv_internal.local_authorize(p_drawer,'view');shop uuid;s private.totus_tpv_local_sales;r private.totus_tpv_local_refunds;line jsonb;entry jsonb;return_lines jsonb:='[]';refund_payments jsonb:='[]';left_lines jsonb:='[]';policy jsonb;qty numeric;prior_qty numeric;original_qty numeric;amount bigint;net_amount bigint;refund_total bigint:=0;total_prior bigint;remaining bigint;allocated bigint:=0;paid record;available bigint;restock boolean;result jsonb;intent jsonb;rest_item private.totus_tpv_local_catalogue;index_no int;
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
 if p_action='get' then return to_jsonb(r)||jsonb_build_object('totalCents',r.total_cents,'saleId',r.sale_id,'reference',coalesce(r.ticket_number->>'label','D-'||left(r.id::text,8)));end if;
 if p_action not in('returnable','prepare','confirm','cancel') then raise exception 'Acción de devolución inválida.';end if;
 perform totus_tpv_internal.local_authorize(p_drawer,'sell');
 if private.totus_can('ventas','edit') is not true then raise exception 'Necesitas permiso de edición de ventas para devolver.';end if;
 if p_action='confirm' and r.status='confirmed' then return to_jsonb(r)||jsonb_build_object('totalCents',r.total_cents,'saleId',r.sale_id,'reference',coalesce(r.ticket_number->>'label','D-'||left(r.id::text,8)));end if;
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
 if p_action='returnable' then return jsonb_build_object('saleId',s.id,'reference',coalesce((select data->>'reference' from private.totus_tpv_local_documents where sale_id=s.id),'Venta '||left(s.id::text,8)),'lines',left_lines,'allowPartial',coalesce((policy->>'allowPartial')::boolean,true),'requireOriginalPayment',true,'availablePayments',coalesce((select jsonb_object_agg(payment_amounts.method,payment_amounts.amount) from (select p.method,sum(p.amount_cents) amount from private.totus_tpv_local_payments p where p.sale_id=s.id group by p.method) payment_amounts),'{}'));end if;
 if p_action='prepare' then
  if p_id is null or s.paid_cents<>s.total_cents or s.total_cents<=0 then raise exception 'Liquida el saldo pendiente antes de preparar el reintegro.';end if;
  intent:=jsonb_build_object('sale',s.id,'session',p_session,'data',p_data);
  select * into r from private.totus_tpv_local_refunds where id=p_id for update;
  if found then if r.actor_id<>actor or r.request<>intent then raise exception 'La solicitud tiene otros datos. Recupera la devolución existente.';end if;return to_jsonb(r)||jsonb_build_object('totalCents',r.total_cents,'saleId',r.sale_id,'reference',coalesce(r.ticket_number->>'label','D-'||left(r.id::text,8)));end if;
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
   net_amount:=round((line->>'netCents')::numeric*(prior_qty+qty)/original_qty)-round((line->>'netCents')::numeric*prior_qty/original_qty);
   return_lines:=return_lines||jsonb_build_array(jsonb_build_object('productId',line->>'productId','name',line->>'name','reference',line->>'reference','qty',qty,'quantityUnit',line->>'quantityUnit','restock',(entry->>'restock')::boolean,'totalCents',amount,'netCents',net_amount));refund_total:=refund_total+amount;
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
 return to_jsonb(r)||jsonb_build_object('totalCents',r.total_cents,'saleId',r.sale_id,'reference',coalesce(r.ticket_number->>'label','D-'||left(r.id::text,8)));
end $function$
;

commit;