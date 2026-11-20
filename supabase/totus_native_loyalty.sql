begin;
set local lock_timeout='5s';
create table if not exists private.totus_tpv_local_loyalty_awards(
 sale_id uuid primary key references private.totus_tpv_local_sales(id) on delete cascade,
 store_id uuid not null references public.ops_stores(id) on delete cascade,customer_id uuid not null references public.ops_customers(id) on delete cascade,
 base_cents bigint not null check(base_cents>0),cents_per_point int not null check(cents_per_point>0),
 earned_points bigint not null check(earned_points>=0),reversed_points bigint not null default 0 check(reversed_points>=0 and reversed_points<=earned_points),
 balance_after_sale bigint not null check(balance_after_sale>=0),reverse_on_refund boolean not null,created_at timestamptz not null default now());
create table if not exists private.totus_tpv_local_loyalty_reversals(
 refund_id uuid primary key references private.totus_tpv_local_refunds(id) on delete cascade,
 sale_id uuid not null references private.totus_tpv_local_loyalty_awards(sale_id) on delete cascade,
 points bigint not null check(points>=0),created_at timestamptz not null default now());
create index if not exists local_loyalty_customer_idx on private.totus_tpv_local_loyalty_awards(store_id,customer_id);
alter table private.totus_tpv_local_loyalty_awards enable row level security;
alter table private.totus_tpv_local_loyalty_reversals enable row level security;
revoke all on private.totus_tpv_local_loyalty_awards,private.totus_tpv_local_loyalty_reversals from public,anon,authenticated,service_role;
create or replace function totus_tpv_internal.local_record_loyalty() returns trigger language plpgsql security definer set search_path='' as $loyalty$
declare config private.totus_tpv_loyalty_settings;award private.totus_tpv_local_loyalty_awards;total bigint;balance bigint;refunded bigint;reversed bigint;
begin
 if tg_table_name='totus_tpv_local_sales' then
  if new.customer_id is null then return new;end if;
  select * into config from private.totus_tpv_loyalty_settings where store_id=new.store_id;
  if not found or not config.enabled then return new;end if;
  if not exists(select 1 from public.ops_customers where id=new.customer_id and store_id=new.store_id) then raise exception 'El cliente no pertenece a la tienda.';end if;
  total:=new.total_cents-coalesce((new.snapshot->>'feeCents')::bigint,0);if total<=0 then return new;end if;
  perform pg_advisory_xact_lock(hashtextextended('tpv-local-loyalty:'||new.store_id::text||':'||new.customer_id::text,0));
  select coalesce(sum(earned_points-reversed_points),0) into balance from private.totus_tpv_local_loyalty_awards where store_id=new.store_id and customer_id=new.customer_id;
  insert into private.totus_tpv_local_loyalty_awards(sale_id,store_id,customer_id,base_cents,cents_per_point,earned_points,balance_after_sale,reverse_on_refund)
  values(new.id,new.store_id,new.customer_id,total,config.cents_per_point,total/config.cents_per_point,balance+total/config.cents_per_point,config.reverse_on_refund);
 else
  if new.status<>'confirmed' or old.status='confirmed' then return new;end if;
  select * into award from private.totus_tpv_local_loyalty_awards where sale_id=new.sale_id;
  if not found or not award.reverse_on_refund then return new;end if;
  perform pg_advisory_xact_lock(hashtextextended('tpv-local-loyalty:'||award.store_id::text||':'||award.customer_id::text,0));
  select * into award from private.totus_tpv_local_loyalty_awards where sale_id=new.sale_id for update;
  if exists(select 1 from private.totus_tpv_local_loyalty_reversals where refund_id=new.id) then return new;end if;
  select least(award.base_cents,coalesce(sum((line->>'totalCents')::bigint),0)) into refunded from private.totus_tpv_local_refunds f cross join lateral jsonb_array_elements(f.lines) line where f.sale_id=new.sale_id and f.status='confirmed';
  reversed:=award.earned_points-(award.base_cents-refunded)/award.cents_per_point;
  insert into private.totus_tpv_local_loyalty_reversals(refund_id,sale_id,points) values(new.id,new.sale_id,greatest(0,reversed-award.reversed_points));
  update private.totus_tpv_local_loyalty_awards set reversed_points=greatest(reversed_points,reversed) where sale_id=new.sale_id;
 end if;
 return new;
end $loyalty$;
revoke all on function totus_tpv_internal.local_record_loyalty() from public,anon,authenticated,service_role;
drop trigger if exists z_native_sale_loyalty on private.totus_tpv_local_sales;
create trigger z_native_sale_loyalty after insert on private.totus_tpv_local_sales for each row execute function totus_tpv_internal.local_record_loyalty();
drop trigger if exists z_native_refund_loyalty on private.totus_tpv_local_refunds;
create trigger z_native_refund_loyalty after update of status on private.totus_tpv_local_refunds for each row execute function totus_tpv_internal.local_record_loyalty();
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
 return doc;
end $function$
;
commit;