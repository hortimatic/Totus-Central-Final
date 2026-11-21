// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=dbda891be25d2ff6550618cf6a41b9f393363fd6';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=dbda891be25d2ff6550618cf6a41b9f393363fd6');
export {WorkerMessageHandler};
