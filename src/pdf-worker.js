// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=1e404d598ffbe91bdc5403a09e4e799843b7bf74';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=1e404d598ffbe91bdc5403a09e4e799843b7bf74');
export {WorkerMessageHandler};
