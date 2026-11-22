-- Stable, chronological catalogue numbers. Keep all UUIDs, SKUs and source IDs.
begin;
lock table public.products in share row exclusive mode;
create sequence if not exists public.products_display_number_seq;
alter table public.products add column if not exists display_number bigint;
with numbered as (
 select id,row_number() over(order by created_at,id)+(select coalesce(max(display_number),0) from public.products) number
 from public.products where display_number is null and source_id is null
) update public.products p set display_number=n.number from numbered n where n.id=p.id;
select setval('public.products_display_number_seq',greatest(1,coalesce((select max(display_number) from public.products),0)),exists(select 1 from public.products));
alter sequence public.products_display_number_seq owned by public.products.display_number;
alter table public.products alter column display_number set default nextval('public.products_display_number_seq');
create unique index if not exists products_display_number_uq on public.products(display_number);
revoke all on sequence public.products_display_number_seq from public,anon;
grant usage on sequence public.products_display_number_seq to authenticated;
-- Expose the already issued document number; do not issue/renumber any receipt.
do $repair$
declare definition text;needle text:='to_jsonb(s)||jsonb_build_object(''name''';
begin
 definition:=pg_get_functiondef('public.totus_local_store_workspace(uuid,text,text,uuid,uuid,jsonb)'::regprocedure);
 if position(needle in definition)=0 then raise exception 'El lector de ventas ha cambiado: revisar antes de actualizar.';end if;
 definition:=replace(definition,needle,'to_jsonb(s)||coalesce((select jsonb_build_object(''reference'',d.prefix||d.number::text,''display_number'',d.number,''ticket_number'',d.data->''ticket_number'') from private.totus_tpv_local_documents d where d.sale_id=s.id and d.store_id=s.store_id),''{}''::jsonb)||jsonb_build_object(''name''');
 definition:=replace(definition,'''Venta ''||left(s.id::text,8)','coalesce((select ''Venta ''||d.prefix||d.number::text from private.totus_tpv_local_documents d where d.sale_id=s.id and d.store_id=s.store_id),''Venta sin numeración'')');
 execute definition;
end $repair$;
commit;
