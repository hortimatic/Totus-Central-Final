// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=49d2fb1f37b48dd7bc0b6bd35a29e1a042eecd54';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=49d2fb1f37b48dd7bc0b6bd35a29e1a042eecd54');
export {WorkerMessageHandler};
