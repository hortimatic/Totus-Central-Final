const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uuid=v=>typeof v==='string'&&/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(v);
export function operatorChoices(value,owner){
 if(value?.actorId!==owner||!Array.isArray(value.items)||value.items.length>2000||value.items.some(r=>!uuid(r?.operatorId)||typeof r.name!=='string'||!r.name.trim()||r.name.length>200||/[\x00-\x1f\x7f]/.test(r.name)||typeof r.loginEmail!=='string'||r.loginEmail.length>254||!/^([^\s@]+)@([^\s@]+)$/.test(r.loginEmail))||new Set(value.items.map(r=>r.operatorId)).size!==value.items.length)throw Error('No se han podido comprobar los operadores de este puesto.');
 return value.items.map(r=>({operatorId:r.operatorId,name:r.name,loginEmail:r.loginEmail})).sort((a,b)=>a.name.localeCompare(b.name,'es')||a.operatorId.localeCompare(b.operatorId));
}
export function operatorAvailability(value,owner){const items=operatorChoices(value,owner);if(value.enabled!==undefined&&typeof value.enabled!=='boolean'||value.enabled===false&&items.length)throw Error('No se ha podido comprobar la disponibilidad del cambio de operador.');return {enabled:value.enabled!==false,items};}
export function createOperatorPicker(){let active=null;
 function cancel(){active?.finish(null);}
 async function choose({items=[],unavailable=false}={}){
  if(active)throw Error('Termina primero el cambio de operador.');
  const names=new Map();for(const row of items)names.set(row.name,(names.get(row.name)||0)+1);
  return new Promise(resolve=>{const dialog=document.createElement('dialog');let settled=false;const entry={finish};active=entry;
   function finish(value){if(settled)return;settled=true;if(active===entry)active=null;if(dialog.open)dialog.close();dialog.remove();resolve(value);}
   dialog.className='tpv-quantity-dialog tpv-operator-dialog tpv-visual-operator';dialog.setAttribute('aria-labelledby','tpvOperatorTitle');dialog.innerHTML=`<form><header><span class="tpv-dialog-eyebrow">USUARIO DEL MOSTRADOR</span><h3 id="tpvOperatorTitle">¿Quién va a continuar?</h3><p>Cada persona entra con su propia cuenta. Cambiar de usuario no realiza el cierre de caja.</p></header>${unavailable?'<p role="status" class="tpv-operator-unavailable">No se ha podido cargar el equipo. Puedes entrar con otra cuenta.</p>':''}<div class="tpv-operator-choice-list">${items.map(r=>`<label class="tpv-operator-choice"><input type="radio" name="operator" value="${esc(r.operatorId)}" required><span class="tpv-choice-avatar">${esc(r.name.split(/\s+/).slice(0,2).map(part=>part[0]).join('').toLocaleUpperCase('es'))}</span><span><strong>${esc(r.name)}</strong><small>${names.get(r.name)>1?esc(r.loginEmail):'Usuario autorizado de Central'}</small></span><b>✓</b></label>`).join('')}<label class="tpv-operator-choice"><input type="radio" name="operator" value="other" required><span class="tpv-choice-avatar">＋</span><span><strong>Otra cuenta de Central</strong><small>Acceder con otro usuario</small></span><b>✓</b></label></div><footer><button type="button" class="btn secondary" data-operator-cancel>Cancelar cambio</button><button class="btn primary" type="submit">Continuar con este usuario →</button></footer><p class="tpv-operator-login-note">El siguiente paso cerrará tu sesión de este equipo para que entre la persona seleccionada.</p></form>`;
   dialog.addEventListener('cancel',event=>{event.preventDefault();finish(null);});dialog.addEventListener('close',()=>finish(null));dialog.querySelector('[data-operator-cancel]').onclick=()=>finish(null);
   dialog.querySelector('form').onsubmit=event=>{event.preventDefault();const selected=dialog.querySelector('form').elements.operator.value;if(selected==='other')finish({loginEmail:'',name:''});else{const row=items.find(r=>r.operatorId===selected);if(row)finish({...row});}};
   document.body.append(dialog);dialog.showModal();dialog.querySelector('input').focus();
  });
 }
 return {choose,cancel};
}
