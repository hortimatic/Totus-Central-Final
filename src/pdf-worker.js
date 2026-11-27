// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=8f52eef05c862ae862d911e455dee74fc96a845b';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=8f52eef05c862ae862d911e455dee74fc96a845b');
export {WorkerMessageHandler};
