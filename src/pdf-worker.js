// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=a6b725d2c27e1b8dd5ebb4f53404f641b6e27dd9';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=a6b725d2c27e1b8dd5ebb4f53404f641b6e27dd9');
export {WorkerMessageHandler};
