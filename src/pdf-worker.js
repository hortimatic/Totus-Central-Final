// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=5039a0843093125484f95696a90712c1d0355c9e';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=5039a0843093125484f95696a90712c1d0355c9e');
export {WorkerMessageHandler};
