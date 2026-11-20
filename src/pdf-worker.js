// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=c34ef0d48641df6dced049ad909d66dd6b8b3cdb';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=c34ef0d48641df6dced049ad909d66dd6b8b3cdb');
export {WorkerMessageHandler};
