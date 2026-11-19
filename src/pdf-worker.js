// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=ff39fccb618d59c393b9947ece450ce7b9bf4163';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=ff39fccb618d59c393b9947ece450ce7b9bf4163');
export {WorkerMessageHandler};
