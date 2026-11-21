// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=4dc57035565450676e085a82dc11b64980174cf1';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=4dc57035565450676e085a82dc11b64980174cf1');
export {WorkerMessageHandler};
