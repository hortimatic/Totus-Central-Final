// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=ab758a884192e14febe1936565ab15c5346d4d21';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=ab758a884192e14febe1936565ab15c5346d4d21');
export {WorkerMessageHandler};
