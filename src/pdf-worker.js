// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=654c17e4e481e4a0fbf47a65021d1c6480a355f9';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=654c17e4e481e4a0fbf47a65021d1c6480a355f9');
export {WorkerMessageHandler};
