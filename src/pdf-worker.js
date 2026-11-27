// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=f6a572fbf3fed4aa850e28289127f99f1c8ec27d';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=f6a572fbf3fed4aa850e28289127f99f1c8ec27d');
export {WorkerMessageHandler};
