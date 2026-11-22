// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=1506befdc97cea2a86a08039583c63e6c7cb0716';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=1506befdc97cea2a86a08039583c63e6c7cb0716');
export {WorkerMessageHandler};
