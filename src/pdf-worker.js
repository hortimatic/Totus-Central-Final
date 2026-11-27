// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=c9a82a729015c0126c6ca38c7b7b4b47c0b15b7b';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=c9a82a729015c0126c6ca38c7b7b4b47c0b15b7b');
export {WorkerMessageHandler};
