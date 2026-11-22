// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=716227ab4e97e1688cd9246487dd4053ee9986ff';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=716227ab4e97e1688cd9246487dd4053ee9986ff');
export {WorkerMessageHandler};
