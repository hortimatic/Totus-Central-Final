// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=e7b6386e615354cfda934766d5f1e516d0ea65aa';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=e7b6386e615354cfda934766d5f1e516d0ea65aa');
export {WorkerMessageHandler};
