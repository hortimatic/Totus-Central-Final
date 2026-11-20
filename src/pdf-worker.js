// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=7aa8c303191d8bfb73e18aad10bd83c8fd1e3915';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=7aa8c303191d8bfb73e18aad10bd83c8fd1e3915');
export {WorkerMessageHandler};
