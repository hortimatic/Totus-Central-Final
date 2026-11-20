// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=9b5bdd402be98ddba53a94e68f81cb70828db6e5';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=9b5bdd402be98ddba53a94e68f81cb70828db6e5');
export {WorkerMessageHandler};
