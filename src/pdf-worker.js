// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=02708a426d908ba5f0c1b538a0a41db2b27146f6';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=02708a426d908ba5f0c1b538a0a41db2b27146f6');
export {WorkerMessageHandler};
