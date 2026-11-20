// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=7936c4b82857c62a900bbc308546410965633f87';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=7936c4b82857c62a900bbc308546410965633f87');
export {WorkerMessageHandler};
