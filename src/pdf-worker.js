// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=213106b7494ca2968105b19b503055fd0150354b';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=213106b7494ca2968105b19b503055fd0150354b');
export {WorkerMessageHandler};
