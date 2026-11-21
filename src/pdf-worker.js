// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=2c915e1c89111ef7f9c7c04a1a60027161522af4';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=2c915e1c89111ef7f9c7c04a1a60027161522af4');
export {WorkerMessageHandler};
