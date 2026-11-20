// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=43436f5f65baaf44819127982fbdfe96c3ff9576';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=43436f5f65baaf44819127982fbdfe96c3ff9576');
export {WorkerMessageHandler};
