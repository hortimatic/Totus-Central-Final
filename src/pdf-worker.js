// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=a58f9c4f48eb599616e7cc8844993337c1dd26d7';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=a58f9c4f48eb599616e7cc8844993337c1dd26d7');
export {WorkerMessageHandler};
