// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=d4c15edb1efcc739e7d598d019fc3abea26471a2';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=d4c15edb1efcc739e7d598d019fc3abea26471a2');
export {WorkerMessageHandler};
