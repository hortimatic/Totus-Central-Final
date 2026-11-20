// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=61fed0329ddd264d36c587eba75ade07473e3ea2';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=61fed0329ddd264d36c587eba75ade07473e3ea2');
export {WorkerMessageHandler};
