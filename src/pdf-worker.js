// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=874c6938e6739ddf493afd7e1440d80388d46f15';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=874c6938e6739ddf493afd7e1440d80388d46f15');
export {WorkerMessageHandler};
