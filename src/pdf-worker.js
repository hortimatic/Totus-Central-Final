// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=5fd2dc6f05dbb86f1167541d0988c4b2dafe5677';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=5fd2dc6f05dbb86f1167541d0988c4b2dafe5677');
export {WorkerMessageHandler};
