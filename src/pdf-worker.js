// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=dd70bc386ad589e84b253f26b65ade708038efd7';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=dd70bc386ad589e84b253f26b65ade708038efd7');
export {WorkerMessageHandler};
