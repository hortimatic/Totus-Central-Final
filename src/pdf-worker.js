// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=8166b11adce6af11b8cacc08ed44fa9e7f6836f9';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=8166b11adce6af11b8cacc08ed44fa9e7f6836f9');
export {WorkerMessageHandler};
