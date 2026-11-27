// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=295ec0486daed20df0c9b3fba198225e60d1766b';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=295ec0486daed20df0c9b3fba198225e60d1766b');
export {WorkerMessageHandler};
