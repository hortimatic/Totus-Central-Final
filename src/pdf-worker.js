// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=c5e2de5c01d9bab743d9cb3106a6de0111d201b0';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=c5e2de5c01d9bab743d9cb3106a6de0111d201b0');
export {WorkerMessageHandler};
