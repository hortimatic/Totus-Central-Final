# Totus Central Final

Entorno futuro de Totus Central. Aplicación: https://totuscentralfinal.totuscode.com/tpv

## Alcance vigente — 25/11/2026

Existen dos líneas independientes. **Producción no se modifica. En Final se trabaja exclusivamente en TotusTPV**, conservando los demás módulos, sus datos y su funcionalidad. Esta revisión actualiza documentación; no cambia el comportamiento de la aplicación.

El recorrido que hay que conservar es: puesto y caja autorizados → catálogo de la tienda → ticket → cálculo verificado → confirmación → pedido en el PrestaShop seleccionado → lectura del resultado y conciliación. Reutilizar los adaptadores, servicios y diarios existentes. No crear otro TPV, otra conexión o un servicio paralelo para sustituir lo que ya funciona.

## Para continuar

1. Leer [Recorrido, arquitectura, historia y relevo](docs/RELEVO_Y_RECORRIDOS.md).
2. Leer [Pendientes y objetivo conservado](docs/PENDIENTES_Y_OBJETIVO.md). El objetivo general está suspendido; no autoriza trabajar ahora en otros módulos.
3. Comprobar la revisión viva de Final antes de preparar un cambio. Distinguir fuente, artefacto publicado y servicios desplegados: no son el mismo repositorio ni comparten necesariamente el mismo SHA.
4. Resolver un punto de TPV cada vez, pasar las pruebas pertinentes y comprobarlo desde la interfaz propia. Registrar versión, evidencia y pendientes. Una publicación o una simulación no prueban una venta real.

## Mapa técnico

| Recurso | Ubicación / regla |
|---|---|
| Este repositorio | `hortimatic/Totus-Central-Final`, rama `main`: artefacto estático publicado y documentación vigente |
| Fuente completa conocida | Carpeta local `output/final-tpv-payment-release`, commit `c756981be8312b6f10d1e8e5b0ec390c11246c7f`; incluye servicios, SQL y pruebas. Consultar el relevo para la raíz y los cambios externos |
| Artefacto funcional de referencia | `a2b080f304720c2814cd5ed83a7319cd40b97166`; una revisión posterior solo documental no cambia esa referencia de código |
| Supabase Final | `ltwfmhilbvpzqdgjhvjb`; `totus-tpv` v11 en el inventario del 25/11 |
| PrestaShop de pruebas | `https://preproduccion.hortimatic.com` |
| Producción protegida | `hortimatic/Totus-Central`, rama `totus-central`; Supabase `awmojepsasikxocoeqtu`. Solo referencia de lectura |

**Límite de portabilidad:** clonar este repositorio entrega el frontend publicado y algunos SQL/pruebas, pero no el conjunto completo de backend, migraciones y pruebas del fuente; en particular, falta el servicio TPV completo. El relevo identifica el fuente local y los archivos de preproducción que están fuera de su commit. No desplegar desde un ZIP antiguo ni desde el remoto histórico de producción. Antes de perder el equipo de trabajo debe conservarse ese conjunto en un respaldo privado verificable.

## Reglas de conservación

- No modificar otros módulos ni sus cálculos para arreglar el TPV.
- No borrar ni repetir pedidos, pagos, facturas, movimientos de caja o auditoría al resolver una respuesta incierta.
- Una venta descuenta existencias una vez en cada sistema; su pedido no debe provocar una segunda resta por sincronización.
- No instalar, ampliar o retirar módulos de PrestaShop sin autorización y comprobación de dependencias. El circuito actualmente verificado utiliza un recurso ya instalado: no afirmar que funciona sin él ni retirarlo a ciegas.
- No subir secretos, contabilidad, documentos privados ni sesiones a GitHub. El anexo privado y los originales pertenecen a Fuentes y a las ubicaciones privadas autorizadas.
- `hortimatic/Totus-TPV` fue eliminado por autorización expresa el 25/11/2026. **El TPV integrado y sus datos se conservan.**

La próxima entrega debe actualizar estos dos documentos y este README en Final, sin trasladar cambios a producción.
