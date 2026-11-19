// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=545787bef649757425a9f0058acf219a4252fa16';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=545787bef649757425a9f0058acf219a4252fa16');
export {WorkerMessageHandler};
