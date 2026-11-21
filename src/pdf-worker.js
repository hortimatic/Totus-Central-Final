// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=3e87ae3d42c2316c945230e51ade6d3f72ca3690';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=3e87ae3d42c2316c945230e51ade6d3f72ca3690');
export {WorkerMessageHandler};
