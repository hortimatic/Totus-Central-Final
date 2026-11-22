// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=0a93a633146f84ce46a1642276f1046c9046241e';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=0a93a633146f84ce46a1642276f1046c9046241e');
export {WorkerMessageHandler};
