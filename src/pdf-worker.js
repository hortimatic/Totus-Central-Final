// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=f687f31258a5aba7822b368ee73f0ac5555a9232';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=f687f31258a5aba7822b368ee73f0ac5555a9232');
export {WorkerMessageHandler};
