// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=f5e7ab1e0b2c684c8e7582a9af7e47822ebac8af';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=f5e7ab1e0b2c684c8e7582a9af7e47822ebac8af');
export {WorkerMessageHandler};
