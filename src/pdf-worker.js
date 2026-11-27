// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=cf0734be4a145f2eda078b1871c46bd32fde9ca1';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=cf0734be4a145f2eda078b1871c46bd32fde9ca1');
export {WorkerMessageHandler};
