// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=90fb00ddff1236f69d2209deff7799963f1d6575';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=90fb00ddff1236f69d2209deff7799963f1d6575');
export {WorkerMessageHandler};
