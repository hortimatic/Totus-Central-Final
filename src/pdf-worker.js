// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=603281a068b6e6a22323154e4de1692de7470f18';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=603281a068b6e6a22323154e4de1692de7470f18');
export {WorkerMessageHandler};
