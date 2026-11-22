// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=1c50ceabc08bbd31d762bbde49df7ce7210e0f69';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=1c50ceabc08bbd31d762bbde49df7ce7210e0f69');
export {WorkerMessageHandler};
