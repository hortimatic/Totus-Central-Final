// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=8ad483537c8fcd1f8720845c185ee337277325a8';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=8ad483537c8fcd1f8720845c185ee337277325a8');
export {WorkerMessageHandler};
