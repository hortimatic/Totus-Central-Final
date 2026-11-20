// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=6975f19bfe140c567e8a009ddc1bcd1d4d6410fe';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=6975f19bfe140c567e8a009ddc1bcd1d4d6410fe');
export {WorkerMessageHandler};
