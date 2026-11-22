// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=7638aa0a45447c738679f0f9049e521b7df3e740';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=7638aa0a45447c738679f0f9049e521b7df3e740');
export {WorkerMessageHandler};
