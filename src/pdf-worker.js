// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=d90256b2b4d5b63d2e422fd6f22282ab808f6125';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=d90256b2b4d5b63d2e422fd6f22282ab808f6125');
export {WorkerMessageHandler};
