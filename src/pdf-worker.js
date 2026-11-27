// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=d8406c01d7a66ad480bcd1aabd80fa6cda456ce1';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=d8406c01d7a66ad480bcd1aabd80fa6cda456ce1');
export {WorkerMessageHandler};
