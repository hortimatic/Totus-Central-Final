// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=22929641cf807cb03329ec6d55ebc86855894ef2';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=22929641cf807cb03329ec6d55ebc86855894ef2');
export {WorkerMessageHandler};
