// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=7a9d24cdfbc23b4e41da7a68edcba8c83ad738f8';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=7a9d24cdfbc23b4e41da7a68edcba8c83ad738f8');
export {WorkerMessageHandler};
