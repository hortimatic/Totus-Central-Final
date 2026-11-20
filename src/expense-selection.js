import {inRange} from './utils.js?v=df4c8d39776ae963dde611a17c0555fcc78a4484';
import {matchesText} from './report-period.js?v=df4c8d39776ae963dde611a17c0555fcc78a4484';
import {isExpensePaymentEvidence} from './calculations.js?v=df4c8d39776ae963dde611a17c0555fcc78a4484';

// Keep the expense list and its download on the same scope.
export function selectExpenses(data,filters={}, {invoices=false}={}){
 const documents=new Map((data.documents||[]).map(d=>[String(d.id),d]));
 return (data.expenses||[]).filter(x=>{
  const doc=documents.get(String(x.document_id)),kind=filters.kind||'all';
  const typeOk=kind==='all'||(kind==='payment'?isExpensePaymentEvidence(x):kind==='internal'?x.management_only&&!isExpensePaymentEvidence(x):!x.management_only);
  const attachment=invoices?(filters.attachment||'all'):'all';
  return inRange(x.expense_date,filters.from,filters.to)
   &&(!filters.store||filters.store==='all'||x.store_id===filters.store)
   &&typeOk&&(!filters.paid||filters.paid==='all'||x.paid_status===filters.paid)
   &&(attachment==='all'||(attachment==='attached'?!!doc:!doc))
   &&matchesText(filters.query,/internet inteligente/i.test(x.supplier_name||'')?'Vaperalia':'',x.supplier_name,x.supplier_tax_id,x.invoice_number,x.description,...(invoices?[doc?.original_name]:[x.payment_method,x.notes,(data.stores||[]).find(s=>s.id===x.store_id)?.name]));
 });
}
