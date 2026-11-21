// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=41240daa6d305c91ae2c71a3faa9efc99a1f103d';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=41240daa6d305c91ae2c71a3faa9efc99a1f103d');
export {WorkerMessageHandler};
