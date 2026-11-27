// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=e874fd121963336dbc179362ff9ffdcd3984793b';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=e874fd121963336dbc179362ff9ffdcd3984793b');
export {WorkerMessageHandler};
