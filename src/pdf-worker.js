// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=1c9496485c67f761a29b486587df30ecedc00e3e';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=1c9496485c67f761a29b486587df30ecedc00e3e');
export {WorkerMessageHandler};
