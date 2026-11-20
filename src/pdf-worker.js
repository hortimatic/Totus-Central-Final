// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=19d87f3f7d1b2b86be73374ca6b8d3108cac6288';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=19d87f3f7d1b2b86be73374ca6b8d3108cac6288');
export {WorkerMessageHandler};
