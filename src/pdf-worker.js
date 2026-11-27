// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=0f6aa6125db316c544d604082cff3780b18ef552';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=0f6aa6125db316c544d604082cff3780b18ef552');
export {WorkerMessageHandler};
