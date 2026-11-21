// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=a6814a13e601d9abd958191ca6aa458ec2ab32cf';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=a6814a13e601d9abd958191ca6aa458ec2ab32cf');
export {WorkerMessageHandler};
