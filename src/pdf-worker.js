// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=9fcb86f16c7f9493d9beb7e60d0a0e065d7c8d9e';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=9fcb86f16c7f9493d9beb7e60d0a0e065d7c8d9e');
export {WorkerMessageHandler};
