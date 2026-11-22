import {buildStoreMonthlyWorkbook} from './excel.js?v=0a93a633146f84ce46a1642276f1046c9046241e';
import {selectReportData} from './report-period.js?v=0a93a633146f84ce46a1642276f1046c9046241e';
export function monthlyDiaryFile(data,{store,year,month},engine){
 const from=`${year}-${String(month).padStart(2,'0')}-01`;
 const to=`${year}-${String(month).padStart(2,'0')}-${new Date(year,month,0).getDate()}`;
 const selected=selectReportData(data,{from,to,store:store.id,query:''});
 const wb=buildStoreMonthlyWorkbook({store,year,month,...selected,categories:data.categories},engine);
 const bytes=engine.write(wb,{type:'array',bookType:'xlsx',cellStyles:true});
 return new File([bytes],`Gastos y ventas ${String(store.name).replace(/[\\/:*?"<>|\x00-\x1f]/g,'_')} ${year}-${String(month).padStart(2,'0')}.xlsx`,{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
}
