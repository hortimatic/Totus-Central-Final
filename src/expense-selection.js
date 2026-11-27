import {inRange} from './utils.js?v=a9041eed381bfab7aa13a5f0e40787ad08f9500f';
import {matchesText} from './report-period.js?v=a9041eed381bfab7aa13a5f0e40787ad08f9500f';
import {isExpensePaymentEvidence} from './calculations.js?v=a9041eed381bfab7aa13a5f0e40787ad08f9500f';

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
