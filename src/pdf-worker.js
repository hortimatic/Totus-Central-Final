// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=3285e2076261036c4b7d62728b54465f824faedc';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=3285e2076261036c4b7d62728b54465f824faedc');
export {WorkerMessageHandler};
