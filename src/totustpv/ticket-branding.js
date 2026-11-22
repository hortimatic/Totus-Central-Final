import {prepareChatBackground} from '../chat-preferences.js?v=7a9d24cdfbc23b4e41da7a68edcba8c83ad738f8';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function ticketLogoData(value){
 if(value==='')return '';
 if(typeof value!=='string'||value.length>350000||!/^data:image\/(png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(value))throw Error('El logo debe ser una imagen PNG o WebP válida.');
 let bytes;try{bytes=atob(value.split(',')[1]);}catch{throw Error('La imagen del logo está incompleta.');}
 const png=bytes.startsWith('\x89PNG\r\n\x1a\n'),webp=bytes.startsWith('RIFF')&&bytes.slice(8,12)==='WEBP';
 if(bytes.length<24||value.startsWith('data:image/png;')&&!png||value.startsWith('data:image/webp;')&&!webp)throw Error('No se reconoce la imagen del logo.');
 return value;
}
export function createTicketBranding({actor,storage,store,canEdit}){
 let scope=null,saved={logoData:'',revision:0,canEdit:false},draft=null,epoch=0;
 const identity=()=>actor();
 const normalize=value=>{if(!value||!Number.isSafeInteger(value.revision)||value.revision<0||typeof value.canEdit!=='boolean')throw Error('No se ha podido comprobar el logo de la tienda.');return {...value,logoData:ticketLogoData(value.logoData)};};
 const key=s=>'totus:tpv:ticket-branding:v1:'+identity()+':'+s.storeId;
 const current=()=>draft??saved.logoData;
 async function open(next,live){
  const stamp=++epoch,owner=identity(),observed=live?await store(next):JSON.parse(storage.getItem(key(next))||'null')||{logoData:'',revision:0,canEdit:true};
  if(stamp!==epoch||owner!==identity())throw Error('La sesión ha cambiado. Vuelve a consultar el logo.');
  saved=normalize(observed);scope={...next,live,owner};draft=null;
 }
 const allowed=()=>!!scope&&scope.owner===identity()&&saved.canEdit&&canEdit();
 return {open,logoData:current,savedLogo:()=>saved.logoData,hasDraft:()=>draft!==null&&draft!==saved.logoData,
  html(){const image=current();return `<section class="tpv-ticket-branding"><header><h4>Logo del ticket</h4><p>Un logo para esta tienda y todas sus cajas. Se utiliza también al imprimir el ticket regalo.</p></header><div class="tpv-ticket-logo-editor">${image?`<img src="${esc(image)}" alt="Logo preparado para el ticket">`:'<span class="tpv-ticket-logo-empty" aria-hidden="true">▧</span>'}<div><label>Subir logo desde el equipo<input type="file" accept="image/png,image/jpeg,image/webp" data-tpv-ticket-logo ${allowed()?'':'disabled'}></label><small>PNG, JPG o WebP · hasta 5 MB. Conserva la transparencia y se adapta al ticket.</small></div></div><form data-tpv-form="ticket-branding"><div class="inline-actions"><button type="button" class="btn secondary" data-tpv-action="ticket-logo-remove" ${allowed()&&image?'':'disabled'}>Quitar logo</button><button type="submit" class="btn primary" ${allowed()&&draft!==null&&draft!==saved.logoData?'':'disabled'}>Guardar logo de la tienda</button></div><p role="status">${draft!==null&&draft!==saved.logoData?'Logo preparado · guarda para conservarlo.':image?'Logo guardado para esta tienda.':'Si no subes uno, se utiliza el logo de la tienda conectada cuando está disponible.'}</p></form></section>`;},
  async change(file){if(!allowed())throw Error('No tienes permiso para cambiar el logo.');const stamp=epoch,owner=identity(),image=await prepareChatBackground(file,{preserveAlpha:true});if(stamp!==epoch||owner!==identity()||!allowed())throw Error('La tienda o la sesión ha cambiado.');draft=ticketLogoData(image);},
  remove(){if(!allowed())throw Error('No tienes permiso para cambiar el logo.');draft='';},
  async save(){if(!allowed()||draft===null)throw Error('Prepara el logo antes de guardar.');const image=draft,stamp=epoch,owner=identity();
   const observed=scope.live?await store(scope,{logoData:image,expectedRevision:saved.revision}):(()=>{const v={logoData:image,revision:saved.revision+1,canEdit:true};storage.setItem(key(scope),JSON.stringify(v));return JSON.parse(storage.getItem(key(scope)));})();
   if(stamp!==epoch||owner!==identity()||!allowed())throw Error('La tienda o la sesión ha cambiado. Vuelve a consultar el logo guardado.');
   const confirmed=normalize(observed);if(confirmed.logoData!==image)throw Error('El logo no ha quedado confirmado. El archivo preparado se conserva.');saved=confirmed;draft=null;
  },reset(){epoch++;scope=null;saved={logoData:'',revision:0,canEdit:false};draft=null;}};
}
