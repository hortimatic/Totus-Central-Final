// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=8f173a6a7e708aa1645f1115adee9fde2dd3d4b7';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=8f173a6a7e708aa1645f1115adee9fde2dd3d4b7');
export {WorkerMessageHandler};
