// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=c421d15ba55ece12c883368bad695cdcadfac450';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=c421d15ba55ece12c883368bad695cdcadfac450');
export {WorkerMessageHandler};
