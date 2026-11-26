// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=362f926e55033fd298207ebeb28d1ec6d21a47dc';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=362f926e55033fd298207ebeb28d1ec6d21a47dc');
export {WorkerMessageHandler};
