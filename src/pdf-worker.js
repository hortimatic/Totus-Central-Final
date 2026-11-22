// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=9669dc9ab5316f7bafc40dffe333e19b6b110e3c';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=9669dc9ab5316f7bafc40dffe333e19b6b110e3c');
export {WorkerMessageHandler};
