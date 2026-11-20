import {parseDecimal} from './calculations.js?v=19d87f3f7d1b2b86be73374ca6b8d3108cac6288';

// Text inputs preserve Spanish decimals; native min/max validation does not apply to them.
export function validateFormNumber(raw,{min=null,max=null,label='Importe'}={}){
 if(!String(raw??'').trim())return null; // Required fields keep their contextual validation.
 const fail=message=>{const error=new Error('El campo "'+label+'" '+message);error.name='ValidationError';throw error;};
 let value;
 try{value=parseDecimal(raw)}catch{fail('contiene un importe no válido.');}
 if(min!==null&&min!==''&&Number.isFinite(Number(min))&&value<Number(min))fail('debe ser igual o superior a '+min+'.');
 if(max!==null&&max!==''&&Number.isFinite(Number(max))&&value>Number(max))fail('debe ser igual o inferior a '+max+'.');
 return value;
}
