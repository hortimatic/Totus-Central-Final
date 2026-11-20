// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=269849942f40e1519781799044386efb0f47d8dc';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=269849942f40e1519781799044386efb0f47d8dc');
export {WorkerMessageHandler};
