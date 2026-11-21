// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=dc19cca8f0753191aaf8b4d05d954d4c41dc430d';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=dc19cca8f0753191aaf8b4d05d954d4c41dc430d');
export {WorkerMessageHandler};
