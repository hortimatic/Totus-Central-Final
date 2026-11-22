// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=bd1b1f9403de01be3c99ab759f8840909eaea3f8';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=bd1b1f9403de01be3c99ab759f8840909eaea3f8');
export {WorkerMessageHandler};
