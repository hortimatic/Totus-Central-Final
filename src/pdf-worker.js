// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=144143a845886b00db51487771b1bf73eb747e6d';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=144143a845886b00db51487771b1bf73eb747e6d');
export {WorkerMessageHandler};
