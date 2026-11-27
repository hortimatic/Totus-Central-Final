// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=534796c8ea14fa105d75e62ddd280e5445bcde48';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=534796c8ea14fa105d75e62ddd280e5445bcde48');
export {WorkerMessageHandler};
