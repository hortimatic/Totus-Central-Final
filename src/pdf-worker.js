// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=1befc154e44d67fa921a8b2d63570a505b87ffee';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=1befc154e44d67fa921a8b2d63570a505b87ffee');
export {WorkerMessageHandler};
