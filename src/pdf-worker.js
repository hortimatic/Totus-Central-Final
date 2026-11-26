// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=9c763b3418101f5c614af036a4bdef0ed77cfdf3';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=9c763b3418101f5c614af036a4bdef0ed77cfdf3');
export {WorkerMessageHandler};
