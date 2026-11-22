// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=87885b6ccdaa65f73df753264a44e46b04d9e6ea';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=87885b6ccdaa65f73df753264a44e46b04d9e6ea');
export {WorkerMessageHandler};
