// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=c131b744541cc527dd7a64ba35d14c672203650f';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=c131b744541cc527dd7a64ba35d14c672203650f');
export {WorkerMessageHandler};
