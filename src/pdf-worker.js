// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=d22c3b270df31ccd0ca860d91fd91f6eee8774d0';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=d22c3b270df31ccd0ca860d91fd91f6eee8774d0');
export {WorkerMessageHandler};
