// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=c576b7e6f0d299e63bdfcaf306a9a5ebfbd53261';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=c576b7e6f0d299e63bdfcaf306a9a5ebfbd53261');
export {WorkerMessageHandler};
