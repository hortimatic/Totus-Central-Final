// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=2558ea01a2459559fc70455191de2d4e5ff99a1f';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=2558ea01a2459559fc70455191de2d4e5ff99a1f');
export {WorkerMessageHandler};
