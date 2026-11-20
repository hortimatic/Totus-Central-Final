// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=f79adea4d40c8aed7cf11d8db235472327847c37';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=f79adea4d40c8aed7cf11d8db235472327847c37');
export {WorkerMessageHandler};
