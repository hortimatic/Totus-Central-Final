// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=6ae2f241f47550fac0fbba1e70abb2f8b58df9a4';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=6ae2f241f47550fac0fbba1e70abb2f8b58df9a4');
export {WorkerMessageHandler};
