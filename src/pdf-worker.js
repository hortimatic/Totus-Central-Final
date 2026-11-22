// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=e802b02448deec386cdfafbf7a5acc34ac94c543';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=e802b02448deec386cdfafbf7a5acc34ac94c543');
export {WorkerMessageHandler};
