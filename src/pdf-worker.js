// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=e37179deb9b0412df84d62554e93f363a0eea9e9';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=e37179deb9b0412df84d62554e93f363a0eea9e9');
export {WorkerMessageHandler};
