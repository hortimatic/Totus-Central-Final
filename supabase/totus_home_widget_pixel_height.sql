-- Per-breakpoint pixel heights; preserve every existing layout and access rule.
begin;
do $repair$
declare definition text;needle text:='''showTop'',''heightMode'']::text[]';
begin
 definition:=pg_get_functiondef('private.totus_home_dashboard(text,jsonb,integer)'::regprocedure);
 if position(needle in definition)=0 then raise exception 'Revisar el formato de Inicio antes de actualizar.';end if;
 definition:=replace(definition,needle,'''showTop'',''heightMode'',''desktopHeightPx'',''tabletHeightPx'',''mobileHeightPx'']::text[]');
 definition:=replace(definition,'or coalesce(jsonb_typeof(item->''layout'')<>''object'',true)',
 'or exists(select 1 from jsonb_each(case when jsonb_typeof(item->''filters'')=''object'' then item->''filters'' else ''{}''::jsonb end) f
     where f.key in (''desktopHeightPx'',''tabletHeightPx'',''mobileHeightPx'')
     and (jsonb_typeof(f.value)<>''number'' or (f.value#>>''{}'') !~ ''^([1-9][0-9]{2}|1[0-9]{3}|2000)$''))
   or coalesce(jsonb_typeof(item->''layout'')<>''object'',true)');
 execute definition;
 definition:=pg_get_functiondef('private.totus_home_styles(text,uuid,text,integer)'::regprocedure);
 needle:='''columns'',''heightMode'')';
 if position(needle in definition)=0 then raise exception 'Revisar el formato de estilos antes de actualizar.';end if;
 definition:=replace(definition,needle,'''columns'',''heightMode'',''desktopHeightPx'',''tabletHeightPx'',''mobileHeightPx'')');
 execute definition;
end $repair$;
commit;
