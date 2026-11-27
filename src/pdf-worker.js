// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=d66ce241905ca27652ad8a3651738d2d5b2189db';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=d66ce241905ca27652ad8a3651738d2d5b2189db');
export {WorkerMessageHandler};
