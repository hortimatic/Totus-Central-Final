// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=359288e44b47ddb2d1b7fc043cafd5e7dc4cbd00';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=359288e44b47ddb2d1b7fc043cafd5e7dc4cbd00');
export {WorkerMessageHandler};
