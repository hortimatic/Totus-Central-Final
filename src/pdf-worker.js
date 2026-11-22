// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=49072b6a1778b8463ea79e5226527c4c8f252e57';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=49072b6a1778b8463ea79e5226527c4c8f252e57');
export {WorkerMessageHandler};
