// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=944bfb74ef1c3bf969f35cf4843a5397640828ca');
export {WorkerMessageHandler};
