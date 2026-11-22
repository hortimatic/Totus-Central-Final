// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=2641f1499763295334ff9efaacc1bf1243a7e5c4';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=2641f1499763295334ff9efaacc1bf1243a7e5c4');
export {WorkerMessageHandler};
