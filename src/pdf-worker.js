// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=5ee1aa5a4b1bc0bd6fa347113f7cee3327dac1ee';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=5ee1aa5a4b1bc0bd6fa347113f7cee3327dac1ee');
export {WorkerMessageHandler};
