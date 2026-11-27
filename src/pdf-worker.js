// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=bbb4da6acbbf356213d9c59a38c6b7fc15b62a8a';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=bbb4da6acbbf356213d9c59a38c6b7fc15b62a8a');
export {WorkerMessageHandler};
