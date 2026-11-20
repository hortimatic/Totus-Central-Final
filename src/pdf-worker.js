// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=d05df74525faeaf4a466e12ac38f433d8c01c702';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=d05df74525faeaf4a466e12ac38f433d8c01c702');
export {WorkerMessageHandler};
