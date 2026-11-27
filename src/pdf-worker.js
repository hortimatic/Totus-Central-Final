// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=85fc1d456f797b7440970d7b4ec0ff8ae8ac4c1a';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=85fc1d456f797b7440970d7b4ec0ff8ae8ac4c1a');
export {WorkerMessageHandler};
