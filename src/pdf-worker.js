// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=d14151ae9c760dd01f94523a7079efa7aad9b68e';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=d14151ae9c760dd01f94523a7079efa7aad9b68e');
export {WorkerMessageHandler};
