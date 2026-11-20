// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=7c563eccbb25714881a1f0b10625dcaaaeeffc7f';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=7c563eccbb25714881a1f0b10625dcaaaeeffc7f');
export {WorkerMessageHandler};
