// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=339b4b81dca246a39b4f135ffae6345e171374f4';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=339b4b81dca246a39b4f135ffae6345e171374f4');
export {WorkerMessageHandler};
