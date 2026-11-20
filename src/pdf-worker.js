// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=aa8cfe74f14db4ffb1ddafd7c56b2b2d2d09d8ec';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=aa8cfe74f14db4ffb1ddafd7c56b2b2d2d09d8ec');
export {WorkerMessageHandler};
