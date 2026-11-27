// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=c5a5309bfbd15ee77f800dac927a0a6118c1dee1';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=c5a5309bfbd15ee77f800dac927a0a6118c1dee1');
export {WorkerMessageHandler};
