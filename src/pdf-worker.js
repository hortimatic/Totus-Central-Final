// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=2ee1bb7846d51e25ababf814bd5aefb08b5233a9';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=2ee1bb7846d51e25ababf814bd5aefb08b5233a9');
export {WorkerMessageHandler};
