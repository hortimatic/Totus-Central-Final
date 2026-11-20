// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=d47e34c2d67e487ec2626ace136c084d5cbbe674';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=d47e34c2d67e487ec2626ace136c084d5cbbe674');
export {WorkerMessageHandler};
