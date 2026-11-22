// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=237a196e5ca263b217506ddf8477198a460a8693';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=237a196e5ca263b217506ddf8477198a460a8693');
export {WorkerMessageHandler};
