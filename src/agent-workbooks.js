import {buildStoreMonthlyWorkbook} from './excel.js?v=7f63f137a7d87a23c91de2760fed365c1eef9af6';
import {selectReportData} from './report-period.js?v=7f63f137a7d87a23c91de2760fed365c1eef9af6';
export function monthlyDiaryFile(data,{store,year,month},engine){
 const from=`${year}-${String(month).padStart(2,'0')}-01`;
 const to=`${year}-${String(month).padStart(2,'0')}-${new Date(year,month,0).getDate()}`;
 const selected=selectReportData(data,{from,to,store:store.id,query:''});
 const wb=buildStoreMonthlyWorkbook({store,year,month,...selected,categories:data.categories},engine);
 const bytes=engine.write(wb,{type:'array',bookType:'xlsx',cellStyles:true});
 return new File([bytes],`Gastos y ventas ${String(store.name).replace(/[\\/:*?"<>|\x00-\x1f]/g,'_')} ${year}-${String(month).padStart(2,'0')}.xlsx`,{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
}
