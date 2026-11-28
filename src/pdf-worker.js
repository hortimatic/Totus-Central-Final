// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=2e9766c23a8517ea98025b755dd0c0dee5a82032';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=2e9766c23a8517ea98025b755dd0c0dee5a82032');
export {WorkerMessageHandler};
