// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=cb055feb6284a6576f72e988faa1a870c73f6eb3';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=cb055feb6284a6576f72e988faa1a870c73f6eb3');
export {WorkerMessageHandler};
