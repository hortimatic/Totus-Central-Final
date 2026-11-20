// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=f280cfc359a44de55ee2eb7c66f1f5311311629e';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=f280cfc359a44de55ee2eb7c66f1f5311311629e');
export {WorkerMessageHandler};
