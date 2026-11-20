// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=310ced609296f2ed6b055f79f08973afc7a8417a';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=310ced609296f2ed6b055f79f08973afc7a8417a');
export {WorkerMessageHandler};
