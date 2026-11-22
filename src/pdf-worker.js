// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=f43b75112ed8f6e861602bfd43fbcac98b087796';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=f43b75112ed8f6e861602bfd43fbcac98b087796');
export {WorkerMessageHandler};
