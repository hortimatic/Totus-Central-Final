// The PDF worker has its own Map prototype; adapt it before loading PDF.js.
import {ensurePdfMapCompatibility} from './pdf-compat.js?v=e360ad724d9d8b11ab1356574f4084246e87be94';
ensurePdfMapCompatibility();
const {WorkerMessageHandler}=await import('./vendor/pdfjs/pdf.worker.mjs?v=e360ad724d9d8b11ab1356574f4084246e87be94');
export {WorkerMessageHandler};
