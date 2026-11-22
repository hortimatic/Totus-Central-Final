// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=b3ca90a2eb900bedd12757512f0cede4095409f1';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=b3ca90a2eb900bedd12757512f0cede4095409f1');
export {WorkerMessageHandler};
