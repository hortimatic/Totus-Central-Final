// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=6aa7e007559c7db80ec5cf16517f8c1043ded6df';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=6aa7e007559c7db80ec5cf16517f8c1043ded6df');
export {WorkerMessageHandler};
