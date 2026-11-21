// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=ee9fdea8dffde89ce1ea8e791c7f0a8041609cb0';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=ee9fdea8dffde89ce1ea8e791c7f0a8041609cb0');
export {WorkerMessageHandler};
