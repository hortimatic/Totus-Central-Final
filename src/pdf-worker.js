// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=16118be4bf82630bb8385f4b7e5b4e4d2b258151';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=16118be4bf82630bb8385f4b7e5b4e4d2b258151');
export {WorkerMessageHandler};
