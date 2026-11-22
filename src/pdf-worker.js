// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=4117cbe27d9beb275e26cbe02963d2fbef4a9972';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=4117cbe27d9beb275e26cbe02963d2fbef4a9972');
export {WorkerMessageHandler};
