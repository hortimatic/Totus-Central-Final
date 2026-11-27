// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=06059a762f053ef487cfc78762c180f4f73bc7ca';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=06059a762f053ef487cfc78762c180f4f73bc7ca');
export {WorkerMessageHandler};
