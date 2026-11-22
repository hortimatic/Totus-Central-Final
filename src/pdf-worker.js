// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=b3036e233d729a20b00edbae5222da7f552030a6';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=b3036e233d729a20b00edbae5222da7f552030a6');
export {WorkerMessageHandler};
