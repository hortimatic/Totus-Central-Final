// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=ad0b4c1ed008836df3354ae4eebc4e499db112ff';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=ad0b4c1ed008836df3354ae4eebc4e499db112ff');
export {WorkerMessageHandler};
