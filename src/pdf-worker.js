// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=c756981be8312b6f10d1e8e5b0ec390c11246c7f';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=c756981be8312b6f10d1e8e5b0ec390c11246c7f');
export {WorkerMessageHandler};
