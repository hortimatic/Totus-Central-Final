// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=fa92926d3e3c3f2671659fd9e62b3b221d107ffa';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=fa92926d3e3c3f2671659fd9e62b3b221d107ffa');
export {WorkerMessageHandler};
