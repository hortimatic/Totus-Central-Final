// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=3d432970111a2a1283bd54ccf3af15bc5af12d0a';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=3d432970111a2a1283bd54ccf3af15bc5af12d0a');
export {WorkerMessageHandler};
