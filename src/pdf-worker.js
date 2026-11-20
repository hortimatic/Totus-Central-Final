// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=5b0474ba65a8a214c07ea3f8964735c96ba5cd4a';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=5b0474ba65a8a214c07ea3f8964735c96ba5cd4a');
export {WorkerMessageHandler};
