// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=9935fd54dc4046938ace9267f3396750414cdcc5';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=9935fd54dc4046938ace9267f3396750414cdcc5');
export {WorkerMessageHandler};
