// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=bb8f497d868456f3291f78bd02caddfdf764be22';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=bb8f497d868456f3291f78bd02caddfdf764be22');
export {WorkerMessageHandler};
