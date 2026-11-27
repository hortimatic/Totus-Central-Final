// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=3c908e1b6b9a494f072f6cc731680e721f13dfa0';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=3c908e1b6b9a494f072f6cc731680e721f13dfa0');
export {WorkerMessageHandler};
