// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=54c1a13a9218e12d6bc9700717c9a107df1b5f2b';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=54c1a13a9218e12d6bc9700717c9a107df1b5f2b');
export {WorkerMessageHandler};
