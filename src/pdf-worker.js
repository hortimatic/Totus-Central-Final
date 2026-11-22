// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=b5de3673bd7cc1748243c7630d6536e1e36c2dc7';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=b5de3673bd7cc1748243c7630d6536e1e36c2dc7');
export {WorkerMessageHandler};
