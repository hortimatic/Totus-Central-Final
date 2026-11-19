// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=7f63f137a7d87a23c91de2760fed365c1eef9af6';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=7f63f137a7d87a23c91de2760fed365c1eef9af6');
export {WorkerMessageHandler};
