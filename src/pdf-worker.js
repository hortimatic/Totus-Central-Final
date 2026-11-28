// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=697baec6aef76473a7cf38602ef8adfdee8fc5f1';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=697baec6aef76473a7cf38602ef8adfdee8fc5f1');
export {WorkerMessageHandler};
