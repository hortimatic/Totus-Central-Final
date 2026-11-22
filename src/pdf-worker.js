// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=dbc4f7ec80e67f88382cebeb6356df6ee5996637';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=dbc4f7ec80e67f88382cebeb6356df6ee5996637');
export {WorkerMessageHandler};
