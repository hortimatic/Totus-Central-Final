// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=5aeb506a2fa4cac550377eea912ffb643389b150';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=5aeb506a2fa4cac550377eea912ffb643389b150');
export {WorkerMessageHandler};
