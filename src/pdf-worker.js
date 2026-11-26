// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=e7bb1d1c1cec5ba9f7d76411e3187d7743d9d386';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=e7bb1d1c1cec5ba9f7d76411e3187d7743d9d386');
export {WorkerMessageHandler};
