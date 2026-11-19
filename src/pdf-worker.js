// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=0371fd1148509cd1aa9d0b90cfaf80d1fe580886';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=0371fd1148509cd1aa9d0b90cfaf80d1fe580886');
export {WorkerMessageHandler};
