// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=97c5053b4136698e8e88ebeca3c2dfc64b2835a5';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=97c5053b4136698e8e88ebeca3c2dfc64b2835a5');
export {WorkerMessageHandler};
