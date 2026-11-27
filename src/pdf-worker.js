// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=026c8998d43a0f69b261cc320a4c4d44c08f2e73';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=026c8998d43a0f69b261cc320a4c4d44c08f2e73');
export {WorkerMessageHandler};
