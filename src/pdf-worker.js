// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=8c9addfe417658da2e140062f4983dfdc7046107';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=8c9addfe417658da2e140062f4983dfdc7046107');
export {WorkerMessageHandler};
