// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=7773867cd26a78076832f506420b829c4224fb9f';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=7773867cd26a78076832f506420b829c4224fb9f');
export {WorkerMessageHandler};
