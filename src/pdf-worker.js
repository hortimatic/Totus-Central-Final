// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=16a74feb6de0cdbcb84a8741110110261fcbc18b';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=16a74feb6de0cdbcb84a8741110110261fcbc18b');
export {WorkerMessageHandler};
