// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=52f6a933a6f8d382fe6bc75685deaf1779c612f7';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=52f6a933a6f8d382fe6bc75685deaf1779c612f7');
export {WorkerMessageHandler};
