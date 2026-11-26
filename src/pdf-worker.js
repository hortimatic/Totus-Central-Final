// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=c2e1b134ea7126004413867d6ae6ae041178d0ed';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=c2e1b134ea7126004413867d6ae6ae041178d0ed');
export {WorkerMessageHandler};
