// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=91a64b47f29e56e4340588813d9c7efa27cfca45';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=91a64b47f29e56e4340588813d9c7efa27cfca45');
export {WorkerMessageHandler};
