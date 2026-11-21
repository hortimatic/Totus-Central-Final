// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=48d7712615757e00ce2a385d144121c0aceae91e';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=48d7712615757e00ce2a385d144121c0aceae91e');
export {WorkerMessageHandler};
