// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=b2e00773312e6e35e461b1c865276f652f025fc0';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=b2e00773312e6e35e461b1c865276f652f025fc0');
export {WorkerMessageHandler};
