// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=9692944840db10112ade8c7e34e1e667ef699fc7';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=9692944840db10112ade8c7e34e1e667ef699fc7');
export {WorkerMessageHandler};
