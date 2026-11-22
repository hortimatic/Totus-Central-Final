// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=67c33f8290725233b72e3443fe35b304f206c2a0';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=67c33f8290725233b72e3443fe35b304f206c2a0');
export {WorkerMessageHandler};
