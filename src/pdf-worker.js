// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=2a913bc91479e87fd1f3f1af1489e61cf2b6cd9e';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=2a913bc91479e87fd1f3f1af1489e61cf2b6cd9e');
export {WorkerMessageHandler};
