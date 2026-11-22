// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=da1c4416b7b6958e31cbc783e65e9ca7902ebea5';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=da1c4416b7b6958e31cbc783e65e9ca7902ebea5');
export {WorkerMessageHandler};
