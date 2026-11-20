// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=2bcae4c455480c2749e5651c0b7fe0b6653c38c4';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=2bcae4c455480c2749e5651c0b7fe0b6653c38c4');
export {WorkerMessageHandler};
