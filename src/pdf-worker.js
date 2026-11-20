// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=df4c8d39776ae963dde611a17c0555fcc78a4484';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=df4c8d39776ae963dde611a17c0555fcc78a4484');
export {WorkerMessageHandler};
