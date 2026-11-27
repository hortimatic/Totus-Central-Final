// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=f6af0c35406bcfbc868c27fc379f57af9845f059';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=f6af0c35406bcfbc868c27fc379f57af9845f059');
export {WorkerMessageHandler};
