// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=2755c8b66ca122ce3ccd212dcd42e0785a795890';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=2755c8b66ca122ce3ccd212dcd42e0785a795890');
export {WorkerMessageHandler};
