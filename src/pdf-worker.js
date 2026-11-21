// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=79c16c1e4849d6cf77feaa802f6126ffb6f9eea6';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=79c16c1e4849d6cf77feaa802f6126ffb6f9eea6');
export {WorkerMessageHandler};
