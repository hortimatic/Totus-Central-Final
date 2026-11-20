// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=2f75e2627eb4533ce333dc5aa04386b8e9820e89';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=2f75e2627eb4533ce333dc5aa04386b8e9820e89');
export {WorkerMessageHandler};
