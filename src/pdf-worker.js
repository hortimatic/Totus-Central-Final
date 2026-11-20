// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=412cce6855be752f16bb5fdc509e574662929cb2';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=412cce6855be752f16bb5fdc509e574662929cb2');
export {WorkerMessageHandler};
