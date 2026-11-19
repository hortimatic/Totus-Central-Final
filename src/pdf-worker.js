// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=afe1ffb1ee1b0b9f66af68e70d2d3bff732828af';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=afe1ffb1ee1b0b9f66af68e70d2d3bff732828af');
export {WorkerMessageHandler};
