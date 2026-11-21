// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=5730da912ef907468e64e8dab0858d8621bf5093';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=5730da912ef907468e64e8dab0858d8621bf5093');
export {WorkerMessageHandler};
