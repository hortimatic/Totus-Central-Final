// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=89ec83abe02f359b7ce50cfdf284ebc99ec7421a';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=89ec83abe02f359b7ce50cfdf284ebc99ec7421a');
export {WorkerMessageHandler};
