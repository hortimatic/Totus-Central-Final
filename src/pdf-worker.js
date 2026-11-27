// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=11cda446c27f9d32e695370ad9187a6a1128874b';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=11cda446c27f9d32e695370ad9187a6a1128874b');
export {WorkerMessageHandler};
