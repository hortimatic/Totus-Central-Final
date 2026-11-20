import assert from 'node:assert/strict';
import {readWebsiteSourceBatch} from '../supabase/functions/totus-web-sync/source-reader.js';
const connection={endpoint:'https://shop.example/api',protocol:'prestashop',secret:'fiction',auth_kind:'basic'};
let attempts=0,observed;
const rows=await readWebsiteSourceBatch(connection,{resource:'customers',cursor:4,pageSize:100},{resolve:async()=>['8.8.8.8'],request:async(url,options)=>{attempts++;observed={url,options};if(attempts===1)throw Error('connection closed');return Response.json({customers:[{id:5,firstname:'Fiction',passwd:'never-store',secure_key:'never-store',addresses:[{token:'never-store',city:'Fiction'}]}]});}});
assert.equal(attempts,2);assert.equal(observed.options.method,'GET');assert.equal(observed.options.redirect,'error');assert.equal(new URL(observed.url).searchParams.get('filter[id]'),'>[4]');assert.equal(rows[0].passwd,undefined);assert.equal(rows[0].secure_key,undefined);assert.equal(rows[0].addresses[0].token,undefined);
await assert.rejects(()=>readWebsiteSourceBatch(connection,{resource:'products',cursor:0,pageSize:25},{resolve:async()=>['8.8.8.8'],request:async()=>new Response('<html>not API</html>',{headers:{'content-type':'text/html'}})}),/página/);
await assert.rejects(()=>readWebsiteSourceBatch(connection,{resource:'products',cursor:0,pageSize:25},{resolve:async()=>['8.8.8.8'],request:async()=>{throw Error('private internal details');}}),error=>/interrumpido/.test(error.message)&&!error.message.includes('internal'));
console.log('Website transport: bounded GET retry, cursor, credential isolation, nested secret removal and non-API response rejection. Simulated only.');
