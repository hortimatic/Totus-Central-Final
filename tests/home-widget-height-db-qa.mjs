import assert from 'node:assert/strict';
import {PGlite} from '@electric-sql/pglite';
import {readFile} from 'node:fs/promises';
const db=new PGlite();try{
await db.exec(await readFile('tests/home-dashboard-db-fixture.sql','utf8'));
await db.exec(`create table public.ops_stores(id uuid);create function private.totus_local_store_access(uuid) returns boolean language sql as $$select true$$;`);
await db.exec(await readFile('supabase/totus_home_dashboard_native_scope.sql','utf8'));
await db.exec(`create function private.totus_home_styles(text,uuid,text,integer) returns jsonb language sql as $$select coalesce(jsonb_object_agg(f.key,f.value),'{}') from jsonb_each('{"heightMode":"manual","query":"private"}'::jsonb) f where f.key in ('topLimit','showMetrics','showTop','columns')$$;`);
await db.exec(await readFile('supabase/totus_home_widget_height.sql','utf8'));
await db.exec(await readFile('supabase/totus_home_widget_pixel_height.sql','utf8'));
await db.exec(`select set_config('request.jwt.claims','{"sub":"aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa","email":"qa-one@example.invalid"}',false);`);
const widget={id:'system',type:'system.status',title:'Sistema',scope:{store:'all'},hidden:false,filters:{heightMode:'manual',desktopHeightPx:207},layout:{desktop:{x:0,y:0,w:6,h:4},tablet:{order:0,w:6,h:4},mobile:{order:0,h:4}}};
const layout={schemaVersion:1,widgets:[widget]};
const saved=await db.query("select private.totus_home_dashboard('save',$1,0) data",[layout]);assert.equal(saved.rows[0].data.revision,1);
const read=await db.query("select private.totus_home_dashboard('read',null,null) data");assert.equal(read.rows[0].data.layout.widgets[0].filters.heightMode,'manual');assert.equal(read.rows[0].data.layout.widgets[0].filters.desktopHeightPx,207);
widget.filters.desktopHeightPx=99999;await assert.rejects(()=>db.query("select private.totus_home_dashboard('save',$1,1)",[layout]));widget.filters.desktopHeightPx=207;widget.filters.heightMode='unsafe';await assert.rejects(()=>db.query("select private.totus_home_dashboard('save',$1,1)",[layout]));
const style=(await db.query('select private.totus_home_styles(null,null,null,null) data')).rows[0].data;assert.deepEqual(style,{heightMode:'manual'});
console.log('PASS fixed-height save/read, enum validation, shared-style retention without private filters');
}finally{await db.close();}
