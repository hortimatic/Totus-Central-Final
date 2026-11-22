// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=364b0053b3635e258790124339f09e45e2fc1fb6';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=364b0053b3635e258790124339f09e45e2fc1fb6');
export {WorkerMessageHandler};
