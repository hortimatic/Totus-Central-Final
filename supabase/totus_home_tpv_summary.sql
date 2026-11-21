-- Inicio reads Central's own sales. No web request and no accounting writes.
begin;
create or replace function public.totus_home_tpv_summary(p_store uuid,p_from date,p_to date) returns jsonb
language plpgsql stable security definer set search_path='' as $$
declare result jsonb;
begin
 if auth.uid() is null or not exists(select 1 from public.profiles where id=auth.uid() and active)
 or private.totus_can('inicio','view') is not true or private.totus_local_store_access(p_store) is not true then raise exception 'No tienes acceso al Inicio de esta tienda.';end if;
 if p_from is null or p_to is null or p_to<p_from then raise exception 'Selecciona un periodo válido.';end if;
 with sales as (
 select s.* from private.totus_tpv_local_sales s where s.store_id=p_store and s.created_at>=p_from::timestamp at time zone 'Europe/Madrid' and s.created_at<(p_to+1)::timestamp at time zone 'Europe/Madrid'
 ), refunds as (
 select r.* from private.totus_tpv_local_refunds r where r.store_id=p_store and r.status='confirmed' and r.created_at>=p_from::timestamp at time zone 'Europe/Madrid' and r.created_at<(p_to+1)::timestamp at time zone 'Europe/Madrid'
 ), movements as (
 select (s.created_at at time zone 'Europe/Madrid')::date day_key,s.total_cents amount,1 orders,0 as return_count from sales s
 union all select (r.created_at at time zone 'Europe/Madrid')::date,-r.total_cents,0,1 from refunds r
 ), lines as (
 select l.value line,1 direction,s.id sale_id from sales s cross join lateral jsonb_array_elements(s.snapshot->'lines') l
 union all select l.value,-1,r.sale_id from refunds r cross join lateral jsonb_array_elements(r.lines) l
 ), priced as (
 select l.*,coalesce(v.cost_net,case when coalesce(p.details#>>'{sourceData,wholesale_price}',p.details->>'costNet','')~'^\d+(\.\d+)?$' then coalesce(p.details#>>'{sourceData,wholesale_price}',p.details->>'costNet')::numeric end) cost,
 case when l.direction=1 then (l.line->>'netCents')::numeric
 else round((l.line->>'totalCents')::numeric*(original.line->>'netCents')::numeric/nullif((original.line->>'totalCents')::numeric,0)) end net
 from lines l left join private.totus_tpv_local_catalogue c on c.store_id=p_store and c.id::text=l.line->>'productId'
 left join public.products p on p.id=c.product_id and p.store_id=p_store left join public.product_variants v on v.id=c.variant_id and v.product_id=p.id
 left join private.totus_tpv_local_sales origin on origin.id=l.sale_id and origin.store_id=p_store
 left join lateral (select x.value line from jsonb_array_elements(origin.snapshot->'lines') x where x.value->>'productId'=l.line->>'productId' limit 1) original on true
 ), daily as (select day_key,sum(amount) amount,sum(orders) orders,sum(return_count) as return_count from movements group by day_key)
 select jsonb_build_object('storeId',p_store,'from',p_from,'to',p_to,'source','totustpv',
 'products',(select count(*) from public.products where store_id=p_store),
 'missingCodes',(select count(*) from private.totus_tpv_local_catalogue where store_id=p_store and ean=''),
 'salesCents',coalesce((select sum(total_cents) from sales),0),'saleCount',(select count(*) from sales),
 'products',(select count(*) from public.products where store_id=p_store),
 'missingCodes',(select count(*) from private.totus_tpv_local_catalogue where store_id=p_store and (ean is null or ean='')),
 'orders',coalesce((select jsonb_agg(jsonb_build_object('id',id,'date',created_at,'total',total_cents)) from (select * from sales order by created_at desc limit 20) x),'[]'),
 'refundCents',coalesce((select sum(total_cents) from refunds),0),'refundCount',(select count(*) from refunds),
 'marginCents',coalesce((select sum(direction*(net-round(cost*(line->>'qty')::numeric*100))) from priced where cost is not null and net is not null),0),
 'marginComplete',not exists(select 1 from priced where cost is null or net is null),'costBasis','current_catalogue',
 'series',coalesce((select jsonb_agg(jsonb_build_object('date',day_key,'salesCents',amount,'orders',orders,'returns',return_count) order by day_key) from daily),'[]'),
 'payments',coalesce((select jsonb_object_agg(method,amount) from(select p.method,sum(p.amount_cents) amount from private.totus_tpv_local_payments p join private.totus_tpv_local_sales s on s.id=p.sale_id and s.store_id=p_store where p.created_at>=p_from::timestamp at time zone 'Europe/Madrid' and p.created_at<(p_to+1)::timestamp at time zone 'Europe/Madrid' group by p.method)t),'{}'),
 'top',coalesce((select jsonb_agg(to_jsonb(t)) from(select line->>'name' name,line->>'productId' id,sum(direction*(line->>'qty')::numeric) quantity,sum(direction*(line->>'totalCents')::numeric) cents from lines group by line->>'productId',line->>'name' order by sum(direction*(line->>'qty')::numeric) desc limit 25)t),'[]')) into result;
 return result;
end $$;
revoke all on function public.totus_home_tpv_summary(uuid,date,date) from public,anon;
grant execute on function public.totus_home_tpv_summary(uuid,date,date) to authenticated;
commit;
