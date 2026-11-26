> Actualización documental · 26/11/2026. La entrega canónica está en **OneDrive → Apps → TotuscentralStudio** y en **Fuentes** del proyecto. Los caminos locales `output/...` de la procedencia histórica ya no son ubicaciones de trabajo vigentes. Producción permanece protegida; este cambio no modifica código ejecutable, SQL, servicios ni configuración.

# Totus Central Final

Entorno futuro de Totus Central. Aplicación: https://totuscentralfinal.totuscode.com/tpv

## Alcance vigente — 26/11/2026

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
| Fuente completa conservada | OneDrive `Apps/TotuscentralStudio/CODIGO/TOTUSCENTRALFINAL_CODIGO_COMPLETO_ACTUAL.zip`; base fuente `c756981be8312b6f10d1e8e5b0ec390c11246c7f`, servicios/esquema/adaptaciones identificados dentro. Fuentes conserva el mismo paquete |
| Artefacto funcional de referencia | `a2b080f304720c2814cd5ed83a7319cd40b97166`; una revisión posterior solo documental no cambia esa referencia de código |
| Supabase Final | `ltwfmhilbvpzqdgjhvjb`; `totus-tpv` v11 en el inventario del 25/11 |
| PrestaShop de pruebas | `https://preproduccion.hortimatic.com` |
| Producción protegida | `hortimatic/Totus-Central`, rama `totus-central`; Supabase `awmojepsasikxocoeqtu`. Solo referencia de lectura |

**Límite de portabilidad:** clonar este repositorio entrega el frontend publicado y algunos SQL/pruebas, pero no el conjunto completo de backend, migraciones y pruebas del fuente; en particular, falta el servicio TPV completo. El relevo identifica el paquete privado del fuente y los archivos de preproducción que están fuera de su commit. No desplegar desde un ZIP antiguo ni desde el remoto histórico de producción. Ese conjunto está conservado en la entrega privada de OneDrive. No crear otro respaldo general ni subir el código privado al repositorio público.

## Reglas de conservación

- No modificar otros módulos ni sus cálculos para arreglar el TPV.
- No borrar ni repetir pedidos, pagos, facturas, movimientos de caja o auditoría al resolver una respuesta incierta.
- Una venta descuenta existencias una vez en cada sistema; su pedido no debe provocar una segunda resta por sincronización.
- No instalar, ampliar o retirar módulos de PrestaShop sin autorización y comprobación de dependencias. El circuito actualmente verificado utiliza un recurso ya instalado: no afirmar que funciona sin él ni retirarlo a ciegas.
- No subir secretos, contabilidad, documentos privados ni sesiones a GitHub. El anexo privado y los originales pertenecen a Fuentes y a las ubicaciones privadas autorizadas.
- `hortimatic/Totus-TPV` fue eliminado por autorización expresa el 25/11/2026. **El TPV integrado y sus datos se conservan.**

## Documentos para otro chat

Leer en Fuentes, o en la misma carpeta privada de OneDrive:

1. `00_ABRIR_PRIMERO.txt`: índice y estado de entrega/auditoría.
2. `01_RECORRIDOS_CHATGPT_TOTUSCENTRALFINAL.txt`: identidad propia, catálogo, alta/edición/copia de productos, cotejo documental, gastos, conexiones, TPV y recuperación.
3. `02_HISTORICO_Y_CONSTRUCCION_TOTUSCENTRAL.txt`: cronología y antecedentes; las instrucciones antiguas no vuelven a estar vigentes.
4. `03_RELEVO_Y_PENDIENTES_TOTUSCENTRALFINAL.txt`: versiones, objetivo pausado, cola completa, pruebas, trabajo sin publicar y límites de Cloud.

`TPV_PENDIENTE` conserva 83 archivos no publicados, capturas y un bundle con HEAD del fuente; no contiene todas las referencias de las ramas remotas. No aplicar ese trabajo automáticamente. Los paquetes de código no son volcados de todos los datos/Auth/Storage ni contienen credenciales. Los documentos no conectan por sí solos las herramientas de un nuevo chat.

El recorrido confirmado utiliza el recurso **ya instalado** `totuscentralconnector` en PrestaShop. No instalar otro ni retirarlo por asumir que no existe. El cotejo compara documentos y **no mueve stock**. La incorporación universal de futuras webs y la sincronización incremental completa siguen pendientes.

Las revisiones de servidor/OneDrive son documentación privada en el índice. No publicar sesiones, contabilidad ni credenciales aquí.
