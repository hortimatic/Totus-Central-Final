import {esc} from '../utils.js?v=a6814a13e601d9abd958191ca6aa458ec2ab32cf';
export function chooseNativeCustomer({adapter,current}){
 return new Promise((resolve,reject)=>{
  const dialog=document.createElement('dialog');dialog.className='tpv-variant-dialog';dialog.setAttribute('aria-label','Elegir cliente de esta tienda');let offset=0,search='',rows=[],more=false,busy=false,closed=false;
  const close=value=>{if(closed)return;closed=true;dialog.remove();resolve(value);};
  const paint=(error='')=>{if(closed)return;dialog.innerHTML=`<h3>Cliente de esta tienda</h3><form><label>Buscar cliente<input name="query" value="${esc(search)}"></label><button class="btn secondary" ${busy?'disabled':''}>Buscar</button></form><p role="status">${esc(error)}</p><div class="stack">${rows.map((c,i)=>`<button class="btn secondary" data-client="${i}" ${busy?'disabled':''}>${esc(c.name)} · ${esc(c.addressLabel)}</button>`).join('')||'<p>Sin clientes para esta búsqueda.</p>'}</div><div class="form-actions"><button class="btn secondary" data-prev ${offset===0||busy?'disabled':''}>Anteriores</button><button class="btn secondary" data-next ${!more||busy?'disabled':''}>Más clientes</button><button class="btn secondary" data-counter ${busy?'disabled':''}>Cliente de mostrador</button><button class="btn secondary" data-cancel ${busy?'disabled':''}>Cancelar</button></div>`;};
  const load=async()=>{busy=true;paint();try{const result=await adapter.customers({search,offset});if(!current())return close(undefined);rows=result.items;more=result.hasMore;}catch(e){paint(e.message);return;}finally{busy=false;}paint();};
  dialog.oncancel=e=>{e.preventDefault();if(!busy)close(undefined);};
  dialog.onsubmit=e=>{e.preventDefault();search=new FormData(e.target).get('query');offset=0;void load();};
  dialog.onclick=async e=>{const button=e.target.closest('button');if(!button||busy)return;if(button.hasAttribute('data-cancel'))return close(undefined);if(button.hasAttribute('data-next')){offset+=50;return load();}if(button.hasAttribute('data-prev')){offset=Math.max(0,offset-50);return load();}if(button.hasAttribute('data-client')||button.hasAttribute('data-counter')){busy=true;try{if(!current())return close(undefined);const value=button.hasAttribute('data-counter')?null:rows[Number(button.dataset.client)];const selected=await adapter.setCustomer(value);if(current())close(selected);else close(undefined);}catch(e){busy=false;paint(e.message);}}};
  document.body.append(dialog);dialog.showModal();void load().catch(e=>{close(undefined);reject(e);});
 });
}
