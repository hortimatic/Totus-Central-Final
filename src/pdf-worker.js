// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=c6aa526e08eb134893f164336b4d8564cf9ef625';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=c6aa526e08eb134893f164336b4d8564cf9ef625');
export {WorkerMessageHandler};
