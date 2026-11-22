// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=f159ae4b47c24b3dc768a2ac0c4d3cc25bf66c5e';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=f159ae4b47c24b3dc768a2ac0c4d3cc25bf66c5e');
export {WorkerMessageHandler};
