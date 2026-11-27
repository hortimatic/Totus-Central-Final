// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=717b5cf40cf16d23a5df7120a6ae149c5c33b141';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=717b5cf40cf16d23a5df7120a6ae149c5c33b141');
export {WorkerMessageHandler};
