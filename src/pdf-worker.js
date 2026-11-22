// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=f441b5656dcad1aeb4a445e81d3eef4679cec949';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=f441b5656dcad1aeb4a445e81d3eef4679cec949');
export {WorkerMessageHandler};
