// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=6dbc85dfd3cda24673631edaba05d8ac23d62aca';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=6dbc85dfd3cda24673631edaba05d8ac23d62aca');
export {WorkerMessageHandler};
