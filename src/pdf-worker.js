// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=d9c8e23fa7a8e657e6f5ca72380b00dc74f93884';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=d9c8e23fa7a8e657e6f5ca72380b00dc74f93884');
export {WorkerMessageHandler};
