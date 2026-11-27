// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=7edde75c9d5da8940c5666bf8ab0430d376c8cda';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=7edde75c9d5da8940c5666bf8ab0430d376c8cda');
export {WorkerMessageHandler};
