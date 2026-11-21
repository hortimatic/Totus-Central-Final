// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=9d6c53a43cddc50c55a1f0c392706c36fb428aa6';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=9d6c53a43cddc50c55a1f0c392706c36fb428aa6');
export {WorkerMessageHandler};
