// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=5542d02e8809ef66dbcc218ccb8549374ec22846';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=5542d02e8809ef66dbcc218ccb8549374ec22846');
export {WorkerMessageHandler};
