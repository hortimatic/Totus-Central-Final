// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=3c55cbb35d5b3f3ea186fadc8ed10092c6d53622';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=3c55cbb35d5b3f3ea186fadc8ed10092c6d53622');
export {WorkerMessageHandler};
