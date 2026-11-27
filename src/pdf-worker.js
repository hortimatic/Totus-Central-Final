// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=0ac9bdf9823a82e606d0b184c8d21d7976257675';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=0ac9bdf9823a82e606d0b184c8d21d7976257675');
export {WorkerMessageHandler};
