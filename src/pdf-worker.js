// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=14d6c73959b3408c59a3c1d805a374dc33394d2c';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=14d6c73959b3408c59a3c1d805a374dc33394d2c');
export {WorkerMessageHandler};
