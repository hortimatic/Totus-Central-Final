// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=59bd4eda1479fb135f11ae80e961454ab0fd7fc8';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=59bd4eda1479fb135f11ae80e961454ab0fd7fc8');
export {WorkerMessageHandler};
