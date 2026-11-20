// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=4d1e222c59b34074ae7f2b6fa27f011c42b42f90';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=4d1e222c59b34074ae7f2b6fa27f011c42b42f90');
export {WorkerMessageHandler};
