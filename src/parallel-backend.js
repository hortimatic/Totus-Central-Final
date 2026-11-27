import {assertParallelBackend} from './parallel-environment.js?v=b47a72ab36cbae222a67df42a6b291d31ae14e4e';
// Existing isolated project rebuilt as Totus Central final.
// TPV acceptance is still pending. Never fall back to the production backend.
export const PARALLEL_PROJECT_REF='ltwfmhilbvpzqdgjhvjb';
export const PARALLEL_SUPABASE_URL='https://ltwfmhilbvpzqdgjhvjb.supabase.co';
export const PARALLEL_SUPABASE_KEY="sb_publishable_nmIr0nxYROarAfIWE-OwYQ_PGn63lRv";
assertParallelBackend({url:PARALLEL_SUPABASE_URL,projectRef:PARALLEL_PROJECT_REF,forbiddenProjectRefs:['awmojepsasikxocoeqtu']});
if(!PARALLEL_SUPABASE_KEY)throw Error('Falta configurar la clave pública del nuevo Totus Central.');
