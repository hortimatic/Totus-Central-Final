// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=e9ad8d479d88104c1b678524b9e2a5299aaebff0';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=e9ad8d479d88104c1b678524b9e2a5299aaebff0');
export {WorkerMessageHandler};
