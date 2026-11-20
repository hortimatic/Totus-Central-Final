// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=749d5b8ffcdef600be8e1ed9e030448ab28d9158';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=749d5b8ffcdef600be8e1ed9e030448ab28d9158');
export {WorkerMessageHandler};
