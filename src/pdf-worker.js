// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=8da935a6e48fdd1da78d09fdbc7d0ac1c9a8d1e2';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=8da935a6e48fdd1da78d09fdbc7d0ac1c9a8d1e2');
export {WorkerMessageHandler};
