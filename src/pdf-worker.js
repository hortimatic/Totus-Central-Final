// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=a4021778cdccea1a1a6d7d008e62c6b07d9c4bb8';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=a4021778cdccea1a1a6d7d008e62c6b07d9c4bb8');
export {WorkerMessageHandler};
