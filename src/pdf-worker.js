// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=3613e4a387e90d41a22dd4f1a7a66bf7ebf9d3ef';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=3613e4a387e90d41a22dd4f1a7a66bf7ebf9d3ef');
export {WorkerMessageHandler};
