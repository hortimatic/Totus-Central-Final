// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=b1df092ac94bbc9feae604eddc2c2a73302aa955';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=b1df092ac94bbc9feae604eddc2c2a73302aa955');
export {WorkerMessageHandler};
