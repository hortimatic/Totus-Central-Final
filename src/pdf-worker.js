// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=319f93aee50605078179fa44dcf196b9e10f5623';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=319f93aee50605078179fa44dcf196b9e10f5623');
export {WorkerMessageHandler};
