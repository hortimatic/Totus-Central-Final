// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=a1f3ba446b892bc18c5f49f7ec2753ee91b18d11';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=a1f3ba446b892bc18c5f49f7ec2753ee91b18d11');
export {WorkerMessageHandler};
