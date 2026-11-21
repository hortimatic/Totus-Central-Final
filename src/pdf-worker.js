// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=a9902937f95dcab66c5cd32208a2b6548cc48125';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=a9902937f95dcab66c5cd32208a2b6548cc48125');
export {WorkerMessageHandler};
