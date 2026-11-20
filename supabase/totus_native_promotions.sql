begin;
set local lock_timeout='5s';
create table if not exists private.totus_tpv_local_promotions(
 id uuid primary key default gen_random_uuid(),source_sale uuid not null unique references private.totus_tpv_local_sales(id) on delete cascade,
 store_id uuid not null references public.ops_stores(id) on delete cascade,code text not null unique default 'TC-'||replace(gen_random_uuid()::text,'-',''),
 issued_cents bigint not null check(issued_cents>0),available_cents bigint not null check(available_cents>=0),
 minimum_cents bigint not null check(minimum_cents>=0),expires_at timestamptz not null,settings_snapshot jsonb not null,
 reserved_quote uuid references private.totus_tpv_local_quotes(id) on delete set null,used_sale uuid unique references private.totus_tpv_local_sales(id),
 used_cents bigint,review_required boolean not null default false,created_at timestamptz not null default now());
alter table private.totus_tpv_local_promotions enable row level security;
revoke all on private.totus_tpv_local_promotions from public,anon,authenticated,service_role;
create index if not exists local_promotions_store_idx on private.totus_tpv_local_promotions(store_id);
create or replace function public.totus_tpv_local_coupon_quote(p_id uuid,p_session uuid,p_lines jsonb,p_method text,p_cash_part bigint default 0,p_customer uuid default null,p_credit boolean default false,p_due date default null,p_coupon text default '',p_draft uuid default null)
returns jsonb language plpgsql security definer set search_path='' as $coupon$
declare actor uuid;session private.totus_tpv_local_sessions;voucher private.totus_tpv_local_promotions;q private.totus_tpv_local_quotes;policy private.totus_tpv_local_policy;result jsonb;line jsonb;revised jsonb:='[]';subtotal bigint;discount bigint;cumulative bigint:=0;previous bigint:=0;share bigint;net bigint;net_total bigint:=0;cash_base bigint;external_base bigint;fee bigint;
begin
 select * into session from private.totus_tpv_local_sessions where id=p_session;
 if not found or session.closed_at is not null then raise exception 'La caja está cerrada.';end if;
 actor:=totus_tpv_internal.local_authorize(session.drawer_id,'sell');
 if p_coupon!~'^TC-[a-f0-9]{32}$' then raise exception 'Escribe el código completo del vale.';end if;
 perform pg_advisory_xact_lock(hashtextextended('local-quote:'||p_id::text,0));
 if p_draft is null then result:=public.totus_tpv_local_quote(p_id,p_session,p_lines,p_method,p_cash_part,p_customer,p_credit,p_due);
 else result:=public.totus_tpv_local_draft_quote(p_id,p_session,p_draft,p_lines,p_method,p_cash_part,p_customer,p_credit,p_due);end if;
 select * into q from private.totus_tpv_local_quotes where id=p_id and actor_id=actor for update;
 if q.snapshot?'couponCode' then
 if q.snapshot->>'couponCode'<>p_coupon then raise exception 'El cálculo ya tiene otro vale. Vuelve al ticket y calcula de nuevo.';end if;return result;end if;
 if exists(select 1 from jsonb_array_elements(q.snapshot->'lines') l where l->>'priceOverride'='true') then raise exception 'No combines un vale con cambios manuales de precio.';end if;
 select * into voucher from private.totus_tpv_local_promotions where code=p_coupon and store_id=session.store_id for update;
 if not found or voucher.used_sale is not null or voucher.available_cents<=0 or voucher.expires_at<=now() then raise exception 'El vale no está disponible en esta tienda, ha caducado o ya se usó.';end if;
 if voucher.reserved_quote is not null and voucher.reserved_quote<>p_id and exists(select 1 from private.totus_tpv_local_quotes where id=voucher.reserved_quote and expires_at>now()) then raise exception 'El vale está reservado en otro cobro. Cancela o recupera ese cobro.';end if;
 subtotal:=(q.snapshot->>'subtotalCents')::bigint;discount:=voucher.available_cents;
 if subtotal<voucher.minimum_cents then raise exception 'La compra no alcanza el mínimo del vale.';end if;
 if discount>=subtotal then raise exception 'El importe de artículos debe superar el valor del vale.';end if;
 for line in select x from jsonb_array_elements(q.snapshot->'lines')x loop
 cumulative:=cumulative+(line->>'totalCents')::bigint;share:=floor(discount::numeric*cumulative/subtotal)::bigint-floor(discount::numeric*previous/subtotal)::bigint;previous:=cumulative;
 net:=round(((line->>'totalCents')::bigint-share)*10000.0/(10000+(line->>'taxBasisPoints')::int));
 revised:=revised||jsonb_build_array(line||jsonb_build_object('totalCents',(line->>'totalCents')::bigint-share,'netCents',net,'couponDiscountCents',share));net_total:=net_total+net;
 end loop;
 subtotal:=subtotal-discount;
 if p_method like 'mixed-%' and p_cash_part not between 1 and subtotal-1 or p_credit and p_cash_part>subtotal then raise exception 'Ajusta el efectivo o el anticipo al importe después del vale.';end if;
 select * into policy from private.totus_tpv_local_policy where store_id=session.store_id;
 cash_base:=case when p_method='cash' then case when p_credit then p_cash_part else subtotal end when p_method like 'mixed-%' then p_cash_part else 0 end;
 external_base:=case when p_method in('cash','credit') then 0 when p_credit then p_cash_part else subtotal-cash_base end;
 fee:=totus_tpv_internal.local_fee(cash_base,policy.fees->'cash')+totus_tpv_internal.local_fee(external_base,policy.fees->replace(p_method,'mixed-',''));
 result:=q.snapshot||jsonb_build_object('lines',revised,'originalSubtotalCents',(q.snapshot->>'subtotalCents')::bigint,'discountCents',discount,'couponCode',voucher.code,'subtotalCents',subtotal,'productsNetCents',net_total,'feeCents',fee,'totalCents',subtotal+fee,'initialPaymentCents',case when p_credit then p_cash_part+fee else subtotal+fee end);
 update private.totus_tpv_local_quotes set snapshot=result where id=p_id;
 update private.totus_tpv_local_promotions set reserved_quote=p_id where id=voucher.id;
 return result||jsonb_build_object('id',q.id,'expiresAt',q.expires_at);
end $coupon$;
revoke all on function public.totus_tpv_local_coupon_quote(uuid,uuid,jsonb,text,bigint,uuid,boolean,date,text,uuid) from public,anon,service_role;
grant execute on function public.totus_tpv_local_coupon_quote(uuid,uuid,jsonb,text,bigint,uuid,boolean,date,text,uuid) to authenticated;
create or replace function public.totus_tpv_local_coupon_release(p_quote uuid) returns boolean language plpgsql security definer set search_path='' as $release$
declare q private.totus_tpv_local_quotes;s private.totus_tpv_local_sessions;
begin
 select * into q from private.totus_tpv_local_quotes where id=p_quote and actor_id=auth.uid() for update;
 if not found then raise exception 'El cálculo no pertenece a tu cuenta.';end if;
 select * into s from private.totus_tpv_local_sessions where id=q.session_id;
 perform totus_tpv_internal.local_authorize(s.drawer_id,'sell');
 if exists(select 1 from private.totus_tpv_local_sales where id=p_quote) then raise exception 'La venta ya está registrada. Consulta su resultado.';end if;
 update private.totus_tpv_local_promotions set reserved_quote=null where reserved_quote=p_quote and used_sale is null;return true;
end $release$;
revoke all on function public.totus_tpv_local_coupon_release(uuid) from public,anon,service_role;
grant execute on function public.totus_tpv_local_coupon_release(uuid) to authenticated;
create or replace function totus_tpv_internal.local_record_promotion() returns trigger language plpgsql security definer set search_path='' as $record$
declare config private.totus_tpv_promotion_settings;voucher private.totus_tpv_local_promotions;amount bigint;remaining bigint;
begin
 if tg_table_name='totus_tpv_local_sales' then
 if new.snapshot?'couponCode' then
 select * into voucher from private.totus_tpv_local_promotions where code=new.snapshot->>'couponCode' and store_id=new.store_id for update;
 if not found or voucher.used_sale is not null or voucher.reserved_quote is distinct from new.id or voucher.expires_at<=now() or voucher.available_cents<>(new.snapshot->>'discountCents')::bigint then raise exception 'El vale ha cambiado. No repitas el cobro: consulta su resultado y recalcula si no se registró.';end if;
 update private.totus_tpv_local_promotions set used_sale=new.id,used_cents=available_cents,available_cents=0,reserved_quote=null where id=voucher.id;
 return new;end if;
 select * into config from private.totus_tpv_promotion_settings where store_id=new.store_id;
 if not found or not config.enabled or new.paid_cents<new.total_cents then return new;end if;
 amount:=case when config.mode='fixed' then config.value else round(new.total_cents::numeric*config.value/10000)::bigint end;
 if amount>0 then insert into private.totus_tpv_local_promotions(source_sale,store_id,issued_cents,available_cents,minimum_cents,expires_at,settings_snapshot)
 values(new.id,new.store_id,amount,amount,config.minimum_cents,now()+make_interval(days=>config.valid_days),to_jsonb(config));end if;
 else
 if new.status<>'confirmed' or old.status='confirmed' then return new;end if;
 select * into voucher from private.totus_tpv_local_promotions where source_sale=new.sale_id for update;
 if not found then return new;end if;
 select greatest(0,s.total_cents-coalesce((select sum(total_cents) from private.totus_tpv_local_refunds where sale_id=s.id and status='confirmed'),0)) into remaining from private.totus_tpv_local_sales s where s.id=new.sale_id;
 amount:=case when remaining=0 then 0 when voucher.settings_snapshot->>'mode'='fixed' then voucher.issued_cents else least(voucher.issued_cents,round(remaining::numeric*(voucher.settings_snapshot->>'value')::int/10000)::bigint) end;
 if voucher.used_sale is not null then update private.totus_tpv_local_promotions set review_required=true where id=voucher.id;
 else update private.totus_tpv_local_promotions set available_cents=amount,reserved_quote=null where id=voucher.id;end if;
 end if;return new;
end $record$;
revoke all on function totus_tpv_internal.local_record_promotion() from public,anon,authenticated,service_role;
drop trigger if exists x_native_sale_promotion on private.totus_tpv_local_sales;
create trigger x_native_sale_promotion after insert on private.totus_tpv_local_sales for each row execute function totus_tpv_internal.local_record_promotion();
drop trigger if exists x_native_refund_promotion on private.totus_tpv_local_refunds;
create trigger x_native_refund_promotion after update of status on private.totus_tpv_local_refunds for each row execute function totus_tpv_internal.local_record_promotion();
commit;
begin;
set local lock_timeout='5s';
CREATE OR REPLACE FUNCTION public.totus_tpv_local_document(p_drawer uuid, p_sale uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare actor uuid:=totus_tpv_internal.local_authorize(p_drawer,'view');store uuid;doc jsonb;
begin
 select store_id into store from public.ops_cash_drawers where id=p_drawer;
 select data into doc from private.totus_tpv_local_documents where sale_id=p_sale and store_id=store;
 if not found then raise exception 'TPV_LOCAL_DOCUMENT_NOT_FOUND';end if;
 if private.totus_can('facturacion','view') is not true then doc:=doc-'customer'-'customer_extra'-'loyalty';end if;
 if private.totus_can('facturacion','view') is true and exists(select 1 from private.totus_tpv_loyalty_settings where store_id=store and show_points) then
 doc:=doc||jsonb_build_object('loyalty',(select jsonb_build_object('earnedPoints',earned_points,'balanceAfterSale',balance_after_sale,'reversedPoints',reversed_points) from private.totus_tpv_local_loyalty_awards where sale_id=p_sale));end if;
 doc:=doc||jsonb_build_object('promotion',(select jsonb_build_object('code',code,'issuedCents',issued_cents,'amountCents',available_cents,'minimumCents',minimum_cents,'expiresAt',expires_at,'status',case when used_sale is not null then 'used' when expires_at<=now() then 'expired' when available_cents=0 then 'cancelled' else 'available' end) from private.totus_tpv_local_promotions where source_sale=p_sale));
 return doc;
end $function$
;
CREATE OR REPLACE FUNCTION totus_tpv_internal.local_issue_receipt()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare series private.totus_tpv_store_receipt_series;v_number bigint;v_prefix text;merchant jsonb;customer jsonb;doc jsonb;items jsonb;totals jsonb;attempts integer:=0;
begin
 perform pg_advisory_xact_lock(hashtextextended('tpv-store-series:'||new.store_id::text,0));
 insert into private.totus_tpv_store_receipt_series(store_id,enabled,sale_prefix,return_prefix,last_sale,last_return) values(new.store_id,false,'V','D',0,0) on conflict do nothing;
 select * into series from private.totus_tpv_store_receipt_series where store_id=new.store_id for update;
 v_number:=series.last_sale+1;v_prefix:=series.sale_prefix;
 while exists(select 1 from private.totus_tpv_receipt_numbers where store_id=new.store_id and kind='sale' and (number=v_number or prefix||number::text=v_prefix||v_number::text))
 or exists(select 1 from private.totus_tpv_local_documents where store_id=new.store_id and (number=v_number or prefix||number::text=v_prefix||v_number::text)) loop
  v_number:=v_number+1;attempts:=attempts+1;if attempts>1000 then raise exception 'TPV_RECEIPT_COUNTER_EXHAUSTED';end if;
 end loop;
 if v_number>999999999 then raise exception 'TPV_RECEIPT_COUNTER_EXHAUSTED';end if;
 update private.totus_tpv_store_receipt_series set last_sale=v_number,revision=revision+1,updated_at=clock_timestamp() where store_id=new.store_id;
 select jsonb_build_object('name',s.name,'address',coalesce(to_jsonb(s)->>'address',''),'phone',coalesce(to_jsonb(s)->>'phone','')) into merchant from public.ops_stores s where s.id=new.store_id;
 if new.customer_id is not null then
  select jsonb_build_object('email',coalesce(to_jsonb(c)->>'email',''),'invoice',jsonb_build_object('name',coalesce(to_jsonb(c)->>'name',''),'address1',coalesce(to_jsonb(c)->>'address',''),'postcode',coalesce(to_jsonb(c)->>'postal_code',''),'city',coalesce(to_jsonb(c)->>'city',''),'country',coalesce(to_jsonb(c)->>'country',''),'phone',coalesce(to_jsonb(c)->>'phone',''),'taxId',coalesce(to_jsonb(c)->>'tax_id',''))) into customer from public.ops_customers c where c.id=new.customer_id;
 end if;
 select jsonb_agg(jsonb_build_object('name',line->'name','reference',line->'reference','quantity',line->'qty','quantity_unit',coalesce(line->>'quantityUnit','unit'),'line_cents',line->'totalCents','tax_excl_cents',line->'netCents','tax_cents',(line->>'totalCents')::bigint-(line->>'netCents')::bigint,'unit_tax_incl_micros',(line->>'unitCents')::bigint*10000,'original_unit_tax_incl_micros',coalesce((line->>'originalUnitCents')::bigint,(line->>'unitCents')::bigint)*10000,'original_line_cents',round(coalesce((line->>'originalUnitCents')::numeric,(line->>'unitCents')::numeric)*(line->>'qty')::numeric)::bigint,'line_discount_cents',greatest(0,round(coalesce((line->>'originalUnitCents')::numeric,(line->>'unitCents')::numeric)*(line->>'qty')::numeric)::bigint-(line->>'totalCents')::bigint-coalesce((line->>'couponDiscountCents')::bigint,0)),'base_name',case when line->>'nameOverride'='true' then line->>'name' else coalesce((select p.name from private.totus_tpv_local_catalogue c join public.products p on p.id=c.product_id where c.store_id=new.store_id and c.id=(line->>'productId')::uuid),line->>'name') end,'variant_name',case when line->>'nameOverride'='true' then '' else coalesce((select string_agg(a.key||': '||a.value,' · ' order by a.key) from private.totus_tpv_local_catalogue c join public.product_variants v on v.id=c.variant_id cross join lateral jsonb_each_text(v.attributes) a where c.store_id=new.store_id and c.id=(line->>'productId')::uuid),'') end,'group_reduction_percent_micros',0,'unit_measure',case when coalesce(line->>'quantityUnit','unit')<>'unit' then jsonb_build_object('label',line->>'quantityUnit','price_micros',(line->>'unitCents')::bigint*10000) else null end)) into items from jsonb_array_elements(new.snapshot->'lines')line;
 select coalesce(jsonb_object_agg(method,cents),'{}'::jsonb) into totals from(select payment->>'method' method,sum((payment->>'amountCents')::bigint) cents from jsonb_array_elements(new.submission->'payments') payment group by payment->>'method') grouped;
 doc:=jsonb_build_object('kind','receipt','existing_document',true,'central_sale',true,'sale_id',new.id,'order_id',v_number,'reference',v_prefix||v_number::text,'ticket_number',jsonb_build_object('kind','sale','number',v_number,'prefix',v_prefix,'label',v_prefix||v_number::text),'currency','EUR','created_at',new.created_at,'merchant',merchant,'lines',items,'payments',totals,'payment_intent',new.submission->'payments','total_cents',new.total_cents,'total_tax_excl_cents',new.snapshot->'productsNetCents','fee_cents',coalesce((new.snapshot->>'feeCents')::bigint,0),'tax_breakdown_complete',coalesce((new.snapshot->>'feeCents')::bigint,0)=0,'paid_at_issue_cents',new.paid_cents,'outstanding_at_issue_cents',new.total_cents-new.paid_cents,'line_discounts_complete',true);
 doc:=doc||jsonb_build_object('operator_name',coalesce((select full_name from public.profiles where id=new.actor_id),'Operador'),'line_discount_cents',coalesce((select sum((x->>'line_discount_cents')::bigint) from jsonb_array_elements(items) x),0),'discount_cents',coalesce((new.snapshot->>'discountCents')::bigint,0),'vouchers',case when new.snapshot?'couponCode' then jsonb_build_array(jsonb_build_object('name','Vale '||(new.snapshot->>'couponCode'),'amount_cents',(new.snapshot->>'discountCents')::bigint)) else '[]'::jsonb end,'vouchers_complete',true); if customer is not null then doc:=doc||jsonb_build_object('customer',customer,'customer_extra',jsonb_build_object('field','taxId','value',coalesce(customer#>>'{invoice,taxId}','')));end if;
 insert into private.totus_tpv_local_documents(sale_id,store_id,number,prefix,data) values(new.id,new.store_id,v_number,v_prefix,doc);
 return new;
end $function$
;
commit;