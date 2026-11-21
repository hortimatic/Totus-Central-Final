// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=9ac5186a129dc5fee4962f60c858a5c226873745';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=9ac5186a129dc5fee4962f60c858a5c226873745');
export {WorkerMessageHandler};
