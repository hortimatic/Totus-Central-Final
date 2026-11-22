// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=21b6b413e6da0a1d3a8422c7c28d64074fedc4d6';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=21b6b413e6da0a1d3a8422c7c28d64074fedc4d6');
export {WorkerMessageHandler};
