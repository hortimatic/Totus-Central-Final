// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=4e5a277196612e264f2dea444776d3045da3ec43';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=4e5a277196612e264f2dea444776d3045da3ec43');
export {WorkerMessageHandler};
