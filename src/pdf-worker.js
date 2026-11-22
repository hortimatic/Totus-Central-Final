// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=625f8270acf84b4b4b0568d90ffd4ffa20d1c75f';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=625f8270acf84b4b4b0568d90ffd4ffa20d1c75f');
export {WorkerMessageHandler};
