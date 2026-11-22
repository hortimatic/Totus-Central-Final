import {inRange} from './utils.js?v=f159ae4b47c24b3dc768a2ac0c4d3cc25bf66c5e';
import {matchesText} from './report-period.js?v=f159ae4b47c24b3dc768a2ac0c4d3cc25bf66c5e';
import {isExpensePaymentEvidence} from './calculations.js?v=f159ae4b47c24b3dc768a2ac0c4d3cc25bf66c5e';

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
