// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=3e62f2d0bb0d3cab0e4991ab6106f8179efdc4b3';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=3e62f2d0bb0d3cab0e4991ab6106f8179efdc4b3');
export {WorkerMessageHandler};
