// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=1d307c6939e047aa126bca5b0cd79a3a483534c0';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=1d307c6939e047aa126bca5b0cd79a3a483534c0');
export {WorkerMessageHandler};
