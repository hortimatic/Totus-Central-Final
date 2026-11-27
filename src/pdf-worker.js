// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=75c4a78792235dc1f66aa2e59eb69c3e44fedfa0';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=75c4a78792235dc1f66aa2e59eb69c3e44fedfa0');
export {WorkerMessageHandler};
