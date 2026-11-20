// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=927b4406f263022a3a0000c98e132c3e50925547';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=927b4406f263022a3a0000c98e132c3e50925547');
export {WorkerMessageHandler};
