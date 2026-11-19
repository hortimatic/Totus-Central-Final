// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=007d885c10a0fcfe194594849a6d9e2023970941';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=007d885c10a0fcfe194594849a6d9e2023970941');
export {WorkerMessageHandler};
