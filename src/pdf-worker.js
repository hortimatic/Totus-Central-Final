// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=e4a5ce4b5b8ab2db429d7d2d0cdee3f89c3c6105';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=e4a5ce4b5b8ab2db429d7d2d0cdee3f89c3c6105');
export {WorkerMessageHandler};
