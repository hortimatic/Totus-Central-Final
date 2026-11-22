// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=fdb0e8f9d291ae1bcde8f886a1329a9677752038';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=fdb0e8f9d291ae1bcde8f886a1329a9677752038');
export {WorkerMessageHandler};
