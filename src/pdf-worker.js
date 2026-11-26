// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=7c9c92923f0b786e3b9ddb3a993a2e71ba8730f5';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=7c9c92923f0b786e3b9ddb3a993a2e71ba8730f5');
export {WorkerMessageHandler};
