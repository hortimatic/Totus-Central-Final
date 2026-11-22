// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=17eb33d66b8590dbd94a7ab512b1db0beee2f42e';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=17eb33d66b8590dbd94a7ab512b1db0beee2f42e');
export {WorkerMessageHandler};
