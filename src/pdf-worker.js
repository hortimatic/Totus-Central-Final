// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=079f4181605ffc1bab62e13f2c749bc723b119dc';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=079f4181605ffc1bab62e13f2c749bc723b119dc');
export {WorkerMessageHandler};
