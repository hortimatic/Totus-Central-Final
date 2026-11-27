// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=a4436da0249a9ef4595f7c987004d4bed68be9e2';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=a4436da0249a9ef4595f7c987004d4bed68be9e2');
export {WorkerMessageHandler};
