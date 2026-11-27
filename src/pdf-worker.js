// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=1387f9fe9917925c3e046968e8bca7056cf90f92';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=1387f9fe9917925c3e046968e8bca7056cf90f92');
export {WorkerMessageHandler};
