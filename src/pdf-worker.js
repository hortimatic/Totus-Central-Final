// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=8fe97e6e2d0fbe6aa00a92914b417079c9ef5804';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=8fe97e6e2d0fbe6aa00a92914b417079c9ef5804');
export {WorkerMessageHandler};
