// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=acc169ca8f42de7cfea99e6548a48c8610de122f';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=acc169ca8f42de7cfea99e6548a48c8610de122f');
export {WorkerMessageHandler};
