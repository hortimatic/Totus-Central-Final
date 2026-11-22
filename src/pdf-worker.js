// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=6d784e195e29a23adea9a6d62073afdf93d0767e';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=6d784e195e29a23adea9a6d62073afdf93d0767e');
export {WorkerMessageHandler};
