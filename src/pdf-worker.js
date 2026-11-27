// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=62d2993b8015e522019612475d2856065cec688d';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=62d2993b8015e522019612475d2856065cec688d');
export {WorkerMessageHandler};
