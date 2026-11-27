// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=7d7ef571fc64f1e11e44a308671ceb3fd39aed44';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=7d7ef571fc64f1e11e44a308671ceb3fd39aed44');
export {WorkerMessageHandler};
