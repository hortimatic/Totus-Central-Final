// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=202a0e5d491e073509b5023aea6c0401b021ce9e';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=202a0e5d491e073509b5023aea6c0401b021ce9e');
export {WorkerMessageHandler};
