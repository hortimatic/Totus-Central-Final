// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=577653ec754f9cb45a53fd995da6cfeac146ba3a';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=577653ec754f9cb45a53fd995da6cfeac146ba3a');
export {WorkerMessageHandler};
