const collator=new Intl.Collator('es',{numeric:true,sensitivity:'base'});
export function tableSortValue(value){
 if(value==null)return null;
 if(typeof value==='number')return Number.isFinite(value)?value:null;
 const text=String(value).trim();
 if(!text||/^(?:—|Sin consultar|Sin verificar|Sin precio|No registrada|No registrado)$/i.test(text))return null;
 const iso=text.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/),local=text.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:[ ,]+(\d{2}):(\d{2})(?::(\d{2}))?)?$/);
 if(iso)return Number(iso[1]+iso[2]+iso[3]+(iso[4]||'00')+(iso[5]||'00')+(iso[6]||'00'));
 if(local)return Number(local[3]+local[2]+local[1]+(local[4]||'00')+(local[5]||'00')+(local[6]||'00'));
 const numeric=text.replace(/[€%\s\u00a0]/g,'').replace('−','-');
 if(/^-?\d+(?:\.\d{3})*(?:,\d+)?$/.test(numeric))return Number(numeric.replace(/\./g,'').replace(',','.'));
 if(/^-?\d+(?:\.\d+)?$/.test(numeric))return Number(numeric);
 return text;
}
export function compareTableValues(a,b,direction='asc'){
 a=tableSortValue(a);b=tableSortValue(b);
 if(a===null||b===null)return a===b?0:a===null?1:-1;
 return (typeof a==='number'&&typeof b==='number'?a-b:collator.compare(String(a),String(b)))*(direction==='desc'?-1:1);
}
