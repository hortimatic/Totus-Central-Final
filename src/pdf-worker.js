// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=b18950adc17c89fc44ec7fadfdb0a7981fe1272f';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=b18950adc17c89fc44ec7fadfdb0a7981fe1272f');
export {WorkerMessageHandler};
