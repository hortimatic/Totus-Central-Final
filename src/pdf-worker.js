// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=9bbe97b2be94de9cab1420c9e6597be440cea629';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=9bbe97b2be94de9cab1420c9e6597be440cea629');
export {WorkerMessageHandler};
