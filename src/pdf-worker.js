// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=d64b6adcc46ee7e6db5cfdbf579903465eaf648d';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=d64b6adcc46ee7e6db5cfdbf579903465eaf648d');
export {WorkerMessageHandler};
