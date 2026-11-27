// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=cd1342fc6f63498ae0149f0a06d8623f4f176e8e';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=cd1342fc6f63498ae0149f0a06d8623f4f176e8e');
export {WorkerMessageHandler};
