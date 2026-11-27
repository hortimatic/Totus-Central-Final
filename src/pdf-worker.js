// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=648f617ef5685fd04b0b71ac5e134c5e8668cc5a';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=648f617ef5685fd04b0b71ac5e134c5e8668cc5a');
export {WorkerMessageHandler};
