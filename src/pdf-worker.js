// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=17dbe483aa78fd244c8a29e983e51235b29adac1';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=17dbe483aa78fd244c8a29e983e51235b29adac1');
export {WorkerMessageHandler};
