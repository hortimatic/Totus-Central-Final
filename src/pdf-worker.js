// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=57318dae1c2bc690a8b45c05770a1fc7a468d27e';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=57318dae1c2bc690a8b45c05770a1fc7a468d27e');
export {WorkerMessageHandler};
