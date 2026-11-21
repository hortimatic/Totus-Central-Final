// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=5f3deddc5835fa16572a39acb881e9da1b926ee7';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=5f3deddc5835fa16572a39acb881e9da1b926ee7');
export {WorkerMessageHandler};
