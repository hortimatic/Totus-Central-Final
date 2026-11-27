// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=2bcf03f5e41a599c2029c90e017cc29c8f79bf59';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=2bcf03f5e41a599c2029c90e017cc29c8f79bf59');
export {WorkerMessageHandler};
