// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=001b9d6077d65f27ad18e6ee0d4c2f7d3e7f8d1d';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=001b9d6077d65f27ad18e6ee0d4c2f7d3e7f8d1d');
export {WorkerMessageHandler};
