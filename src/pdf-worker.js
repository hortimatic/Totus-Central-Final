// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=1afbcd5f00481a5023acba3bc4d645902fe09ec1';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=1afbcd5f00481a5023acba3bc4d645902fe09ec1');
export {WorkerMessageHandler};
