// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=65d4aca5aefe7db28064e4d7cb9b621b2b8f003c';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=65d4aca5aefe7db28064e4d7cb9b621b2b8f003c');
export {WorkerMessageHandler};
