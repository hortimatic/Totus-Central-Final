// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=8bbe57e845eaa74fec8c407006184fcdfcb11b29';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=8bbe57e845eaa74fec8c407006184fcdfcb11b29');
export {WorkerMessageHandler};
