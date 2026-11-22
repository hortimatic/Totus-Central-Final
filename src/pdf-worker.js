// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=4c89eeff498ba3cee0a02bbae358fa79f3625a60';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=4c89eeff498ba3cee0a02bbae358fa79f3625a60');
export {WorkerMessageHandler};
