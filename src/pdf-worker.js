// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=d40925f290fc696bbf08f3479985a755624972a0';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=d40925f290fc696bbf08f3479985a755624972a0');
export {WorkerMessageHandler};
