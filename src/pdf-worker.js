// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=c2172219ebb23fb4d56dfde737b92e11e204c14d';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=c2172219ebb23fb4d56dfde737b92e11e204c14d');
export {WorkerMessageHandler};
