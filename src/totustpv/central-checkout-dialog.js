import {createCentralCheckoutPanel} from './central-checkout-panel.js?v=3c55cbb35d5b3f3ea186fadc8ed10092c6d53622';
export function openCentralCheckoutDialog({adapter,isCurrent,scope,beforeSubmit,document:doc=globalThis.document}){
 return new Promise((resolve,reject)=>{const dialog=doc.createElement('dialog');dialog.className='tpv-variant-dialog tpv-central-checkout-dialog';dialog.setAttribute('aria-label','Confirmar venta de Central');const content=doc.createElement('div');dialog.append(content);let observer=null;const close=value=>{observer?.disconnect();panel.dispose();if(dialog.open)dialog.close();dialog.remove();resolve(value);};const panel=createCentralCheckoutPanel({adapter,isCurrent,beforeSubmit,onSubmitted:sale=>close(sale),onCancel:()=>close(null)});dialog.addEventListener('cancel',event=>{event.preventDefault();if(!isCurrent())close(null);});observer=new MutationObserver(()=>{if(!isCurrent())close(null);});doc.body.append(dialog);observer.observe(doc.body,{childList:true,subtree:true});panel.open(content,scope).then(()=>dialog.showModal()).catch(error=>{observer?.disconnect();panel.dispose();dialog.remove();reject(error);});});
}

export function confirmCentralOperator({name,total,isCurrent,document:doc=globalThis.document}){
 return new Promise(resolve=>{
  if(!isCurrent()){resolve(false);return;}
  const dialog=doc.createElement('dialog');dialog.className='tpv-variant-dialog tpv-central-operator-dialog';dialog.setAttribute('aria-label','Confirmar operador de la venta');
  const heading=doc.createElement('h3');heading.textContent='Confirmar operador';
  const text=doc.createElement('p');text.textContent='¿Confirmas que '+name+' registra esta venta de '+total+'?';
  const footer=doc.createElement('footer'),cancel=doc.createElement('button'),accept=doc.createElement('button');cancel.type=accept.type='button';cancel.className='btn secondary';accept.className='btn primary';cancel.textContent='Cancelar';accept.textContent='Confirmar operador';footer.append(cancel,accept);dialog.append(heading,text,footer);
  const close=value=>{observer.disconnect();if(dialog.open)dialog.close();dialog.remove();resolve(value&&isCurrent());};
  const observer=new MutationObserver(()=>{if(!isCurrent())close(false);});
  cancel.addEventListener('click',()=>close(false));accept.addEventListener('click',()=>close(true));dialog.addEventListener('cancel',event=>{event.preventDefault();close(false);});
  doc.body.append(dialog);observer.observe(doc.body,{childList:true,subtree:true});dialog.showModal();cancel.focus();
 });
}
