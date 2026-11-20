// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=edcbcc4ad7ff80cd1d709a0c3e779eef09bbfd6c';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=edcbcc4ad7ff80cd1d709a0c3e779eef09bbfd6c');
export {WorkerMessageHandler};
