export function returnPolicy(value){
 if(!value||typeof value.allowPartial!=='boolean'||Object.keys(value).some(key=>!['allowPartial','requireOriginalPayment','voucherEnabled','voucherExpiryDays'].includes(key))
  ||(value.requireOriginalPayment!==undefined&&typeof value.requireOriginalPayment!=='boolean')
  ||(value.voucherEnabled!==undefined&&typeof value.voucherEnabled!=='boolean')
  ||(value.voucherExpiryDays!==undefined&&(!Number.isSafeInteger(value.voucherExpiryDays)||value.voucherExpiryDays<1||value.voucherExpiryDays>3650)))
  throw Error('No se ha podido comprobar la configuración de devoluciones.');
 return {
  allowPartial:value.allowPartial,
  requireOriginalPayment:value.requireOriginalPayment===true,
  voucherEnabled:value.voucherEnabled===true,
  voucherExpiryDays:value.voucherExpiryDays??30
 };
}
export function returnPolicyHtml(value,canEdit,draft){
 const policy=returnPolicy(value),checked=draft?draft.allowPartial==='on':policy.allowPartial;
 const origChecked=draft?draft.requireOriginalPayment==='on':policy.requireOriginalPayment;
 const voucherChecked=draft?draft.voucherEnabled==='on':policy.voucherEnabled;
 const voucherDays=draft?.voucherExpiryDays??policy.voucherExpiryDays;
 return `<section class="tpv-return-policy"><h4>Devoluciones · esta caja</h4><form data-tpv-form="return-policy"><label class="tpv-check"><input name="allowPartial" type="checkbox" ${checked?'checked':''} ${canEdit?'':'disabled'}> Permitir devoluciones parciales</label><p class="small muted">Si se desactiva, hay que devolver todas las unidades pendientes del pedido. Se aplica a todos los operadores de esta caja. Las devoluciones ya enviadas se recuperan sin repetir el reintegro.</p><label class="tpv-check"><input name="requireOriginalPayment" type="checkbox" ${origChecked?'checked':''} ${canEdit?'':'disabled'}> Exigir reintegro por los medios de pago originales</label><p class="small muted">En pagos mixtos se reparte proporcionalmente entre los saldos pendientes, con céntimos exactos. El operador revisa y realiza el reintegro antes de confirmarlo; esta opción no ejecuta pagos bancarios.</p><label class="tpv-check"><input name="voucherEnabled" type="checkbox" ${voucherChecked?'checked':''} ${canEdit?'':'disabled'}> Permitir emitir vale de descuento en lugar de efectivo</label><p class="small muted">Al realizar una devolución, el operador podrá elegir entre devolver por los medios originales o generar un vale de descuento para futuras compras.</p><label>Caducidad del vale de devolución · días<input name="voucherExpiryDays" type="number" min="1" max="3650" step="1" value="${Number(voucherDays)||30}" ${canEdit?'':'disabled'}></label>${canEdit?'<button class="btn primary" type="submit">Guardar devoluciones</button>':'<p class="small muted">Necesitas permiso para editar ventas para cambiar esta regla.</p>'}</form></section>`;
}
