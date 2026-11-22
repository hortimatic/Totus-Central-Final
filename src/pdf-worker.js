// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=1d7a88db3ed046d2858025d9683886d451bf521f';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=1d7a88db3ed046d2858025d9683886d451bf521f');
export {WorkerMessageHandler};
