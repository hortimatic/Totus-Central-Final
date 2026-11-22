// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=6c861e082b63ef525821eff77ef1b65fb53728de';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=6c861e082b63ef525821eff77ef1b65fb53728de');
export {WorkerMessageHandler};
