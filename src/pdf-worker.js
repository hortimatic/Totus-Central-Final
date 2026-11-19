// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=2dfeb2bef1ce945a669212cb5be50ea661bea26e';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=2dfeb2bef1ce945a669212cb5be50ea661bea26e');
export {WorkerMessageHandler};
