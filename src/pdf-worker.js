// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=6959d5cdc2c7cc8f8737f2ca2a6e9cf36df3b402';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=6959d5cdc2c7cc8f8737f2ca2a6e9cf36df3b402');
export {WorkerMessageHandler};
