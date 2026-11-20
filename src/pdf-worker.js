// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=80f605a47ceede01c48f1128ffa60515846d6e64';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=80f605a47ceede01c48f1128ffa60515846d6e64');
export {WorkerMessageHandler};
