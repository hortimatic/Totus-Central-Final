// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=3dba11e8bce9ebbd52979f55d946172d711bcd63';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=3dba11e8bce9ebbd52979f55d946172d711bcd63');
export {WorkerMessageHandler};
