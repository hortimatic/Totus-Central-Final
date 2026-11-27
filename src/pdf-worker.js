// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=b4be024f454f6e70cb758fc49dbcbc6edffee4d2';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=b4be024f454f6e70cb758fc49dbcbc6edffee4d2');
export {WorkerMessageHandler};
