// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=ca3a0126b1d066628fa75cf89d90b09b811389a3';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=ca3a0126b1d066628fa75cf89d90b09b811389a3');
export {WorkerMessageHandler};
