// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=269c810969c1cd32fadbc78df96c65826a2eed24';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=269c810969c1cd32fadbc78df96c65826a2eed24');
export {WorkerMessageHandler};
