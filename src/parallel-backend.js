import {assertParallelBackend} from './parallel-environment.js?v=dbda891be25d2ff6550618cf6a41b9f393363fd6';
// Existing isolated project rebuilt as Totus Central final.
// TPV acceptance is still pending. Never fall back to the production backend.
export const PARALLEL_PROJECT_REF='ltwfmhilbvpzqdgjhvjb';
export const PARALLEL_SUPABASE_URL='https://ltwfmhilbvpzqdgjhvjb.supabase.co';
export const PARALLEL_SUPABASE_KEY="sb_publishable_nmIr0nxYROarAfIWE-OwYQ_PGn63lRv";
assertParallelBackend({url:PARALLEL_SUPABASE_URL,projectRef:PARALLEL_PROJECT_REF,forbiddenProjectRefs:['awmojepsasikxocoeqtu']});
if(!PARALLEL_SUPABASE_KEY)throw Error('Falta configurar la clave pública del nuevo Totus Central.');
