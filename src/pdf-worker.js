// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=2963d111447facb4944201d3d3dc23efd1d050a2';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=2963d111447facb4944201d3d3dc23efd1d050a2');
export {WorkerMessageHandler};
