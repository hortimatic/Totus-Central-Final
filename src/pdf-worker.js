// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=852d79ce79de876f12c2d792ce5f25fcff2bfce4';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=852d79ce79de876f12c2d792ce5f25fcff2bfce4');
export {WorkerMessageHandler};
