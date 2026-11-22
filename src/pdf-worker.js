// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=321b8aa9c0cebb22a8179ca8c80cbdfc1b509ed8';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=321b8aa9c0cebb22a8179ca8c80cbdfc1b509ed8');
export {WorkerMessageHandler};
