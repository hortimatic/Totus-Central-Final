// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=7b431c1e79ab87f1be524c794405acf0b2f96450';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=7b431c1e79ab87f1be524c794405acf0b2f96450');
export {WorkerMessageHandler};
