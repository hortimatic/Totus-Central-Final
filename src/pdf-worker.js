// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=94ef6afdabc2bf5fa5d414b0a95222ca69f2c455';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=94ef6afdabc2bf5fa5d414b0a95222ca69f2c455');
export {WorkerMessageHandler};
