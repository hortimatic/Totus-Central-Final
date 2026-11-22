// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=401614c79c82aa0a468693be46d49a014d7358be';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=401614c79c82aa0a468693be46d49a014d7358be');
export {WorkerMessageHandler};
