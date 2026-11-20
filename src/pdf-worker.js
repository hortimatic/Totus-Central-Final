// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=92cf5da0958b88ab0b9c26cc584129665e581316';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=92cf5da0958b88ab0b9c26cc584129665e581316');
export {WorkerMessageHandler};
