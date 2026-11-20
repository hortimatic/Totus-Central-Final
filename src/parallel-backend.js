import {assertParallelBackend} from './parallel-environment.js?v=339b4b81dca246a39b4f135ffae6345e171374f4';
// Existing isolated project rebuilt as Totus Central final.
// TPV acceptance is still pending. Never fall back to the production backend.
export const PARALLEL_PROJECT_REF='ltwfmhilbvpzqdgjhvjb';
export const PARALLEL_SUPABASE_URL='https://ltwfmhilbvpzqdgjhvjb.supabase.co';
export const PARALLEL_SUPABASE_KEY="sb_publishable_nmIr0nxYROarAfIWE-OwYQ_PGn63lRv";
assertParallelBackend({url:PARALLEL_SUPABASE_URL,projectRef:PARALLEL_PROJECT_REF,forbiddenProjectRefs:['awmojepsasikxocoeqtu']});
if(!PARALLEL_SUPABASE_KEY)throw Error('Falta configurar la clave pública del nuevo Totus Central.');
