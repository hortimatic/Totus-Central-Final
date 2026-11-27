// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=21e7728dfd2de66926baf7cc5cf728c4835bd982';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=21e7728dfd2de66926baf7cc5cf728c4835bd982');
export {WorkerMessageHandler};
