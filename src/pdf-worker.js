// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=5d275a985481cf0f8e88bd1538042f6b532fe655';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=5d275a985481cf0f8e88bd1538042f6b532fe655');
export {WorkerMessageHandler};
