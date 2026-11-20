// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=7d97ca64013c9c9215c736033e826690c8604d21';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=7d97ca64013c9c9215c736033e826690c8604d21');
export {WorkerMessageHandler};
