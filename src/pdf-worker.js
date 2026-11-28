// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=3f70339c9278f0c527dd700c9be532655e880838';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=3f70339c9278f0c527dd700c9be532655e880838');
export {WorkerMessageHandler};
