// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=8c461b458bb98bc0e1adc31c2b2823ebe5019bb3';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=8c461b458bb98bc0e1adc31c2b2823ebe5019bb3');
export {WorkerMessageHandler};
