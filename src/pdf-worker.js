// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=3b978bb83415667314c74896141659d4e1d426e4';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=3b978bb83415667314c74896141659d4e1d426e4');
export {WorkerMessageHandler};
