// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=048b472db72953520553bcb8b6c7b1eab99c896b';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=048b472db72953520553bcb8b6c7b1eab99c896b');
export {WorkerMessageHandler};
