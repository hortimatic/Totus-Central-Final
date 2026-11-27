// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=0b35e9d460a59ea45373d9de1da749853dfb90da';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=0b35e9d460a59ea45373d9de1da749853dfb90da');
export {WorkerMessageHandler};
