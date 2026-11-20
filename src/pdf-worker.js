// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=e8e6ac9d608d1643ba8d1aef852486e29fe43a55';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=e8e6ac9d608d1643ba8d1aef852486e29fe43a55');
export {WorkerMessageHandler};
