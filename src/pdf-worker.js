// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=9400e5ccb2e224446c824ec92b5caf14c080413f';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=9400e5ccb2e224446c824ec92b5caf14c080413f');
export {WorkerMessageHandler};
