// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=cf43bb37adf01addd67e506f277475b92f2b2584';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=cf43bb37adf01addd67e506f277475b92f2b2584');
export {WorkerMessageHandler};
