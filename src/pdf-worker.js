// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=25894ea75f8349bb21e30e2da302baaab9a40d00';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=25894ea75f8349bb21e30e2da302baaab9a40d00');
export {WorkerMessageHandler};
