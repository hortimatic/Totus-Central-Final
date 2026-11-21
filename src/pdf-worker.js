// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=6211f41561afde7cdca2c962030b082ada6e768a';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=6211f41561afde7cdca2c962030b082ada6e768a');
export {WorkerMessageHandler};
