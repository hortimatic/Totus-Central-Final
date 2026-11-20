begin;
set local lock_timeout='5s';
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
 select jsonb_agg(jsonb_build_object('name',line->'name','reference',line->'reference','quantity',line->'qty','quantity_unit',coalesce(line->>'quantityUnit','unit'),'line_cents',line->'totalCents','tax_excl_cents',line->'netCents','tax_cents',(line->>'totalCents')::bigint-(line->>'netCents')::bigint,'unit_tax_incl_micros',(line->>'unitCents')::bigint*10000,'original_unit_tax_incl_micros',coalesce((line->>'originalUnitCents')::bigint,(line->>'unitCents')::bigint)*10000,'original_line_cents',round(coalesce((line->>'originalUnitCents')::numeric,(line->>'unitCents')::numeric)*(line->>'qty')::numeric)::bigint,'line_discount_cents',greatest(0,round(coalesce((line->>'originalUnitCents')::numeric,(line->>'unitCents')::numeric)*(line->>'qty')::numeric)::bigint-(line->>'totalCents')::bigint),'base_name',case when line->>'nameOverride'='true' then line->>'name' else coalesce((select p.name from private.totus_tpv_local_catalogue c join public.products p on p.id=c.product_id where c.store_id=new.store_id and c.id=(line->>'productId')::uuid),line->>'name') end,'variant_name',case when line->>'nameOverride'='true' then '' else coalesce((select string_agg(a.key||': '||a.value,' · ' order by a.key) from private.totus_tpv_local_catalogue c join public.product_variants v on v.id=c.variant_id cross join lateral jsonb_each_text(v.attributes) a where c.store_id=new.store_id and c.id=(line->>'productId')::uuid),'') end,'group_reduction_percent_micros',0,'unit_measure',case when coalesce(line->>'quantityUnit','unit')<>'unit' then jsonb_build_object('label',line->>'quantityUnit','price_micros',(line->>'unitCents')::bigint*10000) else null end)) into items from jsonb_array_elements(new.snapshot->'lines')line;
 select coalesce(jsonb_object_agg(method,cents),'{}'::jsonb) into totals from(select payment->>'method' method,sum((payment->>'amountCents')::bigint) cents from jsonb_array_elements(new.submission->'payments') payment group by payment->>'method') grouped;
 doc:=jsonb_build_object('kind','receipt','existing_document',true,'central_sale',true,'sale_id',new.id,'order_id',v_number,'reference',v_prefix||v_number::text,'ticket_number',jsonb_build_object('kind','sale','number',v_number,'prefix',v_prefix,'label',v_prefix||v_number::text),'currency','EUR','created_at',new.created_at,'merchant',merchant,'lines',items,'payments',totals,'payment_intent',new.submission->'payments','total_cents',new.total_cents,'total_tax_excl_cents',new.snapshot->'productsNetCents','fee_cents',coalesce((new.snapshot->>'feeCents')::bigint,0),'tax_breakdown_complete',coalesce((new.snapshot->>'feeCents')::bigint,0)=0,'paid_at_issue_cents',new.paid_cents,'outstanding_at_issue_cents',new.total_cents-new.paid_cents,'line_discounts_complete',true);
 doc:=doc||jsonb_build_object('operator_name',coalesce((select full_name from public.profiles where id=new.actor_id),'Operador'),'line_discount_cents',coalesce((select sum((x->>'line_discount_cents')::bigint) from jsonb_array_elements(items) x),0),'discount_cents',0); if customer is not null then doc:=doc||jsonb_build_object('customer',customer,'customer_extra',jsonb_build_object('field','taxId','value',coalesce(customer#>>'{invoice,taxId}','')));end if;
 insert into private.totus_tpv_local_documents(sale_id,store_id,number,prefix,data) values(new.id,new.store_id,v_number,v_prefix,doc);
 return new;
end $function$
;
revoke all on function totus_tpv_internal.local_issue_receipt() from public,anon,authenticated,service_role;
commit;