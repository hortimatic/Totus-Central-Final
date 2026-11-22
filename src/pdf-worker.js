// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=d5d8d2e125397d81ca0735e0040c664bdbd613ed';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=d5d8d2e125397d81ca0735e0040c664bdbd613ed');
export {WorkerMessageHandler};
