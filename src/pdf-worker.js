// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=6e92618f01c8d3d5d82dea572a0fa5832046542b';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=6e92618f01c8d3d5d82dea572a0fa5832046542b');
export {WorkerMessageHandler};
