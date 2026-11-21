// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=b05ab9860f07aeda52ff72779f0b103c8b10b724';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=b05ab9860f07aeda52ff72779f0b103c8b10b724');
export {WorkerMessageHandler};
