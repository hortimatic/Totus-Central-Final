// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=ebfe063b33c332fa1e355d58165167d0c664fbdd';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=ebfe063b33c332fa1e355d58165167d0c664fbdd');
export {WorkerMessageHandler};
