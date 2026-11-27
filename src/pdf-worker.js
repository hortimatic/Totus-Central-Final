// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=cf78275988b180a3b2ac6f14281728e24bb0f7bf';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=cf78275988b180a3b2ac6f14281728e24bb0f7bf');
export {WorkerMessageHandler};
