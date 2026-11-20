// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=61be05a1dc5bb4d581828819752ba87ab4a46426';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=61be05a1dc5bb4d581828819752ba87ab4a46426');
export {WorkerMessageHandler};
