// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=a45d1f32e981d95eb99a88b5dd183d2bf97403c9';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=a45d1f32e981d95eb99a88b5dd183d2bf97403c9');
export {WorkerMessageHandler};
