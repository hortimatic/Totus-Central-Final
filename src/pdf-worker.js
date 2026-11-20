// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=0781d18ab5403769f1945f9310e62ae5bd7522af';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=0781d18ab5403769f1945f9310e62ae5bd7522af');
export {WorkerMessageHandler};
