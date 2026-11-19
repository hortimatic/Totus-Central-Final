// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=03e435b33817a454f0544371422fa353bcdee400';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=03e435b33817a454f0544371422fa353bcdee400');
export {WorkerMessageHandler};
