// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=a9041eed381bfab7aa13a5f0e40787ad08f9500f';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=a9041eed381bfab7aa13a5f0e40787ad08f9500f');
export {WorkerMessageHandler};
