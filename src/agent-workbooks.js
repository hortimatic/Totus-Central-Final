import {buildStoreMonthlyWorkbook} from './excel.js?v=65d4aca5aefe7db28064e4d7cb9b621b2b8f003c';
import {selectReportData} from './report-period.js?v=65d4aca5aefe7db28064e4d7cb9b621b2b8f003c';
export function monthlyDiaryFile(data,{store,year,month},engine){
 const from=`${year}-${String(month).padStart(2,'0')}-01`;
 const to=`${year}-${String(month).padStart(2,'0')}-${new Date(year,month,0).getDate()}`;
 const selected=selectReportData(data,{from,to,store:store.id,query:''});
 const wb=buildStoreMonthlyWorkbook({store,year,month,...selected,categories:data.categories},engine);
 const bytes=engine.write(wb,{type:'array',bookType:'xlsx',cellStyles:true});
 return new File([bytes],`Gastos y ventas ${String(store.name).replace(/[\\/:*?"<>|\x00-\x1f]/g,'_')} ${year}-${String(month).padStart(2,'0')}.xlsx`,{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
}
