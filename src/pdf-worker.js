// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=88ad0bcc1b93534c17e8fd43e64c3b0b505832bd';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=88ad0bcc1b93534c17e8fd43e64c3b0b505832bd');
export {WorkerMessageHandler};
