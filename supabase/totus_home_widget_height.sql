-- Allow only the explicit height mode in the existing personal layout validator.
-- Does not modify any saved layout, grants, scope checks or business data.
begin;
do $repair$
declare definition text;needle text:='''productView'',''topLimit'',''showMetrics'',''showTop'']::text[]';
begin
 definition:=pg_get_functiondef('private.totus_home_dashboard(text,jsonb,integer)'::regprocedure);
 if position(needle in definition)=0 then raise exception 'El validador de Inicio ha cambiado: revisar antes de actualizar.';end if;
 definition:=replace(definition,needle,'''productView'',''topLimit'',''showMetrics'',''showTop'',''heightMode'']::text[]');
 definition:=replace(definition,'or coalesce(jsonb_typeof(item->''layout'')<>''object'',true)',
 'or (item->''filters'' ? ''heightMode'' and coalesce(item->''filters''->>''heightMode'' not in (''auto'',''manual''),true))
   or coalesce(jsonb_typeof(item->''layout'')<>''object'',true)');
 execute definition;
end $repair$;
do $styles$
declare definition text;needle text:='''topLimit'',''showMetrics'',''showTop'',''columns'')';
begin
 definition:=pg_get_functiondef('private.totus_home_styles(text,uuid,text,integer)'::regprocedure);
 if position(needle in definition)=0 then raise exception 'El formato de estilos ha cambiado: revisar antes de actualizar.';end if;
 definition:=replace(definition,needle,'''topLimit'',''showMetrics'',''showTop'',''columns'',''heightMode'')');
 execute definition;
end $styles$;
commit;
