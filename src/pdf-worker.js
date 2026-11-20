// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=87cebe372dcc61695c0f31c14be7d0381ca8ed30';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=87cebe372dcc61695c0f31c14be7d0381ca8ed30');
export {WorkerMessageHandler};
