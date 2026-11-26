// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=a150c70f11d66dd259a21bf3a664ccda6fd6e11c';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=a150c70f11d66dd259a21bf3a664ccda6fd6e11c');
export {WorkerMessageHandler};
