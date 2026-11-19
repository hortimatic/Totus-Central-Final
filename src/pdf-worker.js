// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=a35f03a08e2a5ea589a2de4ca743ec91b3d50521';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=a35f03a08e2a5ea589a2de4ca743ec91b3d50521');
export {WorkerMessageHandler};
