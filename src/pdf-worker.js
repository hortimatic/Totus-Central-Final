// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=c791a0c82678279622afe2fed55ee25379be7551';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=c791a0c82678279622afe2fed55ee25379be7551');
export {WorkerMessageHandler};
