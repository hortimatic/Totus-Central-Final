// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=08c32cf71e215c33a16a9cdafee4d4e0f9ffec36';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=08c32cf71e215c33a16a9cdafee4d4e0f9ffec36');
export {WorkerMessageHandler};
