// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=24e61f01bf26b898435bbe48eb4307cb9bdc64ec';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=24e61f01bf26b898435bbe48eb4307cb9bdc64ec');
export {WorkerMessageHandler};
