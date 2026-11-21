// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=69e3ca315cb68616856a4eaa9812e3ade5b365c2';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=69e3ca315cb68616856a4eaa9812e3ade5b365c2');
export {WorkerMessageHandler};
