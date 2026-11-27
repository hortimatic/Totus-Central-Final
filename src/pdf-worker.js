// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=b47a72ab36cbae222a67df42a6b291d31ae14e4e';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=b47a72ab36cbae222a67df42a6b291d31ae14e4e');
export {WorkerMessageHandler};
