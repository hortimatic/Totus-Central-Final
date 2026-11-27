// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=2522d21ee7d63b95d896a78f271d611922c0c7b2';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=2522d21ee7d63b95d896a78f271d611922c0c7b2');
export {WorkerMessageHandler};
