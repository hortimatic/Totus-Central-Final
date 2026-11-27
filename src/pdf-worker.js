// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=742682966be65a03937a20564b7e5d4e1f4804fd';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=742682966be65a03937a20564b7e5d4e1f4804fd');
export {WorkerMessageHandler};
