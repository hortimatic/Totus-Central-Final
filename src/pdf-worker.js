// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=79ffad5494069a305c364320c14a05392fa8d62a';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=79ffad5494069a305c364320c14a05392fa8d62a');
export {WorkerMessageHandler};
