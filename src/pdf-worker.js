// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=99d340b4264888b6f2d5fb30d0d43d60d10a5060';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=99d340b4264888b6f2d5fb30d0d43d60d10a5060');
export {WorkerMessageHandler};
