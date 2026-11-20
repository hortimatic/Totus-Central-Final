// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=3f8a42ac7a93f4db74ea20a80842d9ff28911b5e';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=3f8a42ac7a93f4db74ea20a80842d9ff28911b5e');
export {WorkerMessageHandler};
