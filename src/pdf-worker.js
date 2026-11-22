// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=1a7c240896b3236a0c8f7d718f652b5c088672c1';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=1a7c240896b3236a0c8f7d718f652b5c088672c1');
export {WorkerMessageHandler};
