// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=92d388846d3f31a3ccc8592cb3b8b720e23304cd';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=92d388846d3f31a3ccc8592cb3b8b720e23304cd');
export {WorkerMessageHandler};
