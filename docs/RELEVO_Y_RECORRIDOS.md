# Totus Central: recorrido, historia y relevo vigente

Fecha de consolidación: **25/11/2026, Europe/Madrid**. Este documento sustituye como guía activa los relevos acumulados de octubre y noviembre. El historial Git y los originales privados conservan la evidencia detallada; una instrucción antigua no vuelve a estar vigente por aparecer en ellos.

## 1. Decisión actual y dos líneas de trabajo

**Producción:** sistema real utilizado por Hortimatic y NewOldSmok. No modificar código, despliegues, configuración, Supabase, webs, datos ni documentos. Puede consultarse como referencia de lectura, con acceso autorizado. No ejecutar una venta de prueba allí.

**Final:** línea futura, destinada a las webs actualizadas y a un TPV más estable. Actualmente solo se autoriza desarrollar el TPV y sus arreglos necesarios, respetando todos los demás módulos y su funcionalidad. No se ha autorizado promover Final a producción, sustituir la instalación actual, actualizar las webs productivas ni retomar la cola global completa.

La tarea documental del 25/11 no modifica código ejecutable, servicios, SQL, configuraciones ni datos. El objetivo histórico se conserva en PENDIENTES_Y_OBJETIVO.md, sin reactivarlo por redactar este relevo.

## 2. Qué es Totus Central

Central es el sistema de gestión del negocio: mantiene el contexto de tiendas, usuarios y permisos y reúne información comercial, documental y operativa. TotusTPV es un módulo de Central, no una aplicación comercial separada. Debe registrar las ventas como pedidos en la instalación de PrestaShop elegida, conservando caja, operador, pagos y trazabilidad.

La dirección de producto acordada es almacenar una importación inicial completa por web en Central y después actualizar cambios y creaciones. El TPV debe consultar ese catálogo persistido sin descargar otra vez toda la tienda al entrar. Las verificaciones comerciales necesarias antes de confirmar una venta no se eliminan para aparentar velocidad.

Central debe permitir gestionar productos, combinaciones, categorías, alias, contactos de tienda, marcas, proveedores, clientes y direcciones; precios, referencias, imágenes, idiomas e impuestos forman parte de sus datos. Es un objetivo, no una certificación de que toda la sincronización automática esté terminada.

Una web puede ser solo online y gestionarse desde Central sin TPV ni caja. La autonomía de incorporación de futuras webs y esa modalidad siguen pendientes de aceptación completa. No inventar un cajón para hacer aparecer los datos de una web.

## 3. Mapa de instalaciones y versiones

| Línea | Aplicación / repositorio | Supabase | Regla |
|---|---|---|---|
| Producción | `https://totuscentral.totuscode.com`; `hortimatic/Totus-Central`, `totus-central` | `awmojepsasikxocoeqtu` | Intocable; referencia de lectura |
| Final | `https://totuscentralfinal.totuscode.com`; `hortimatic/Totus-Central-Final`, `main` | `ltwfmhilbvpzqdgjhvjb` | Único entorno de desarrollo actual; TPV |
| Web vinculada comprobada en Final | `https://preproduccion.hortimatic.com` | Datos nativos de esa web | Pruebas y configuración expresamente autorizadas; no confundir con `hortimatic.com` |

Versiones de referencia:

- Producción: `7796c354971b47398cb54a28c8c8ad72201c0e7f`, comprobada el 25/11 sin cambios.
- Fuente completa de Final: `c756981be8312b6f10d1e8e5b0ec390c11246c7f`.
- Artefacto frontend de Final anterior a esta actualización documental: `a2b080f304720c2814cd5ed83a7319cd40b97166`.
- Servicio Final `totus-tpv`: v11, JWT obligatorio, inventario del 25/11. Producción conserva v6.
- Otros servicios exclusivos de Final inventariados: `totus-web-sync` v19 y `totus-catalogue-events` v1. Que estén desplegados no acredita que sus automatismos estén activos.

Las cifras y versiones describen la fecha de revisión. Releer HEAD, build-info y versión del servicio antes de un cambio futuro. Un commit documental posterior no significa una nueva versión funcional del TPV.

## 4. Ubicación del código y continuidad real

Raíz local conocida:

`C:/Users/DiegoSequeraBarea/.codex/.chatgpt-projects/g-p-6a91b98de7f8819187585746ab1cc033`

| Elemento | Ubicación relativa a esa raíz |
|---|---|
| Fuente, servicios, SQL y pruebas actuales | `output/final-tpv-payment-release` |
| Artefacto frontend publicado | `output/central-final-hostinger-ui-545787be` |
| Cola histórica del 22/11 | `output/cola-maestra-final-20261122.md` |
| Continuidad técnica anterior | `output/continuidad-final-20261122.md` |
| Adaptaciones de tres PHP instalados | `output/catalogue-module-update-0.1.10/totuscentralconnector/src` |
| Respaldo de esos archivos anteriores | `output/catalogue-module-backup/totuscentralconnector/src` |
| Copias Git previas a la limpieza | `output/limpieza-github-20261125` |
| Consolidación y archivo documental | `output/documentacion-final-20261125` |

**Advertencia esencial:** el repositorio remoto Final contiene el artefacto estático y una selección de SQL/pruebas, no todo el fuente de servicios, pruebas y migraciones. En la referencia inspeccionada hay 52 archivos bajo supabase, pero no el servicio totus-tpv completo. El fuente local conserva un origen histórico de Central: no usar ese remoto para publicar por error sobre producción. El README de Final debe ser la entrada vigente, pero no sustituye un respaldo portable del fuente completo.

Los tres PHP adaptados en preproducción están fuera del commit fuente c756981b. Una actualización que ignore esa diferencia puede reintroducir el fallo de stock/inactivos. La copia `connectors/prestashop/src` más moderna, descrita como 0.2.2 en el relevo anterior, no es equivalente a la revisión realmente instalada. No reemplazar el módulo entero desde esa carpeta.

El paquete comercial de POS TPV/POSTPV es referencia de comportamiento e interfaz. No incorporar su código protegido, licencias, bases de datos o archivos privados al repositorio público. No intentar descifrar ionCube.

## 5. Historia de crecimiento: hechos, no instrucciones de despliegue

| Periodo | Evolución documentada |
|---|---|
| 27–28/08/2026 | Primer historial Git conservado y cargas iniciales del proyecto. No se atribuye una funcionalidad concreta a commits llamados solo Add files via upload. |
| 03/10/2026 | Reconexión de Totus Pricing con un backend Supabase restaurado. |
| 05–06/10/2026 | Pricing se conserva y se incorpora Gestión V6. Separación por módulos; gastos, documentos, facturación, proformas, rectificativas, series, informes y tratamiento fiscal/interno. Se introducen controles contra ingresos duplicados y separación de apertura, venta, pago y retirada. |
| 13–14/10/2026 | Paquete de referencia y plan de auditoría. Producción protegida, pruebas en entorno aislado, una función cada vez y necesidad de comprobar roles, gastos, documentos, exportaciones, caja y fiscalidad. Era un plan; no una auditoría completa ejecutada. |
| Segunda mitad de octubre | Desarrollo documentado de copias por componentes, recuperación, OneDrive, almacenamiento, diarios, cuentas propias de asistentes, permisos, Recepciones y cotejo documental, Pricing con variantes y calendario/Tareas. Los módulos ya construidos se conservan. |
| 24–31/10/2026 | Estabilización de Chat, adjuntos, tareas, apariencia y navegación. Contrato 4 de agentes con identidad propia, catálogo de operaciones y relectura. Relevo 39850832 y manuales de mantenimiento. Una respuesta queued nunca acreditó una operación completada. |
| 01–06/11/2026 | Auditorías funcionales y de estabilidad; navegación, tablas, interfaz, directorios y organización del centro PrestaShop. Las auditorías se mantienen como antecedentes, no como autorizaciones vigentes para tocar producción. |
| 07–09/11/2026 | Recorridos de alta/copia/edición de Productos, etapas persistidas, idiomas instalados incluso inactivos, combinaciones, imágenes, revisión y recuperación sin repetir POST. Las pruebas documentadas no acreditan todas las variantes de todos los temas de tienda. |
| 10–13/11/2026 | Inicio y estilos, contactos sincronizados, margen/calendario, cargas de directorios, avisos online, tablas y caja. PR189–193 documentan mejoras y límites. El rendimiento medido con latencias simuladas no es una promesa de tiempo real. |
| 13–15/11/2026 | Estudio de POS TPV, primeras pruebas de pedido en preproducción y contratos del futuro TPV. La primera prueba requirió conciliación manual del estado: no era una venta autónoma completa. Se acuerda integración en Central. |
| 14–19/11/2026 | Creación del Supabase Final aislado y evolución del TPV integrado: catálogo, diario, permisos de caja, recuperación, documentos y configuración. La rama `feat/totustpv-stock-receipts-20261116` es antecesora del fuente posterior de Final y no se considera basura por su nombre. |
| 22/11/2026 | Reorganización compacta del mostrador; catálogo completo, imágenes y jerarquía; recuperación del adaptador de venta heredado; configuración de la web de preproducción; pedidos recibidos y aceptados por el usuario. Venta sin stock y producto inactivo comprobadas con existencia negativa nativa. No se cerró la estabilidad general del TPV ni la sincronización incremental global. |
| 25/11/2026 | Limpieza autorizada: eliminación de `hortimatic/Totus-TPV` y 14 ramas integradas de Central, con copias Git previas. Producción conserva commit y contenido. Auditoría de las 15 ramas restantes y los dos Supabase solo en lectura. Nueva decisión: desarrollo exclusivamente del TPV en Final; resto de módulos protegido. |

No se afirman hitos anteriores al primer historial conservado ni se reconstruyen hechos a partir de nombres de carpetas. La documentación histórica contiene estados contradictorios de una misma jornada: la aceptación final del usuario prevalece sobre una advertencia anterior para ese caso concreto, sin convertirla en aceptación universal.

## 6. Módulos construidos que hay que preservar

| Área | Responsabilidad y límites esenciales |
|---|---|
| Inicio | Resúmenes, indicadores, calendario, estilos y acceso a trabajo. No fabricar margen si faltan costes ni confundir estimación con contabilidad. |
| Precio / Pricing | Productos y variantes, costes y precios por unidad, descuentos y márgenes. No sustituir por un editor simplificado del TPV. |
| Ventas / PrestaShop | Consulta de pedidos, pagos, líneas y contexto de conexión; funciones de Recepciones integradas. No sumar dos veces ventas web y cierres. |
| Productos | Alta, edición, copia, idiomas, imágenes, combinaciones, categorías, atributos y revisión de publicación. Preservar diarios, huellas y recuperación. |
| Clientes / Proveedores / Marcas | Directorios por tienda, edición y contexto nativo. No duplicarlos al configurar un TPV. |
| Cajas | Caja/cajón, aperturas, movimientos, arqueos y cierres; efectivo separado de tarjeta/Bizum y del abono bancario histórico. |
| Gastos | Factura, líneas, impuesto, pago y adjunto son elementos distintos. Los gastos internos e impuestos ya pagados no se deducen otra vez. |
| Facturación | Borradores, emisión, numeración, proformas, rectificativas y documentos externos. Reimprimir no emite otra factura. |
| Documentos | Original, almacenamiento, vínculo, visualización y retirada trazable. Una subida aislada no registra contabilidad. |
| Fiscalidad / Informes | Periodos, separación real/fiscal, conciliación y exportaciones. No alterar periodos aceptados para forzar coincidencias. |
| Chat / Tareas | Canales, adjuntos, peticiones, calendario y repeticiones. Una tarea o mensaje no mueve stock ni registra un gasto por sí mismo. |
| Administración / Configuración | Usuarios, roles, permisos, negocio, interfaz, almacenamiento, copias y registro. La seguridad también se valida en servidor. |
| APIs / Automatizaciones | Conexiones, capacidades y reglas existentes. No exponer credenciales ni activar otra vía automática sin autorización. |

Existencia de código no equivale a aceptación exhaustiva de todos estos módulos. Su revisión global queda conservada en pausa; en esta fase se realizan únicamente regresiones necesarias para protegerlos al arreglar el TPV.

## 7. Arquitectura existente del TPV

La interfaz `/tpv` usa la sesión y los componentes de Central. El contexto incluye cuenta/usuario, establecimiento, conexión, tienda nativa, cajón y sesión. Dos webs pueden compartir un número nativo de producto o shop: ese número por sí solo no identifica el origen.

Componentes relevantes del fuente conocido:

- `src/app.js`: integración y fábrica de adaptador. El recorrido remoto se recuperó usando `createCentralTpvAdapter` y `tpvClient` existentes.
- `src/totustpv/central-adapter.js`: adaptación del cliente al circuito central/nativo y lectura del catálogo persistido. Confirmar el nombre/ruta en el árbol vigente antes de editar.
- `checkout-service.js`, `postgres-journal.js`, `model.js` y el servidor de `src/totustpv/`: coordinación, registro, reglas y recuperación.
- `server/native-capability-adapter.js`, `native-transport.js`, `native-request-service.js`, `quote-contract.js`, `payment-readback.js`: preparación, traducción, comprobación y resultado nativo.
- `supabase/functions/totus-tpv/index.ts` y `handler.js`: servicio desplegado con sus dependencias. No desplegar un solo archivo omitiendo los archivos compartidos del manifiesto.
- `workspace.js` y `reference-interface.css`: composición del puesto y controles compactos.
- `totus-web-sync` y los lectores existentes: importación y catálogo; no son una certificación de sincronización automática global.

El catálogo local se reutiliza para lectura y costes; no sustituye la prueba del pedido remoto. En la recuperación se retiró un intento adicional de puente de checkout, identificado como de2e8399. No resucitar ese borrador como solución sin estudiar el circuito operativo ya restablecido.

## 8. Recorrido de venta que hay que conservar

1. **Entrar y elegir contexto.** Sesión Central legítima; web, tienda, operador y caja autorizados. Recuperar la sesión existente cuando corresponda; no abrir otra para escapar de un error.
2. **Cargar el catálogo persistido.** Productos, combinaciones, imágenes y categorías de esa tienda. Diferenciar producto padre y artículo/variante al contar y filtrar. La categoría inicial configurada aparece seleccionada; debajo, sus hijas y productos según la jerarquía nativa.
3. **Preparar el ticket.** Buscar por nombre/referencia/código, elegir variante y unidades, cliente y dirección válidos. La ficha `i` consulta datos sin añadir una línea ni deformar el catálogo. Cantidad, impuestos y precio corresponden al contexto seleccionado.
4. **Aplicar reglas del TPV.** Venta sin stock e inactivos son opciones propias del TPV; no activan el producto online ni cambian las reglas del escaparate. Deben persistir y ser verificadas también por servidor. Permitir stock negativo no implica saltarse permisos, cantidades mínimas u otras restricciones nativas.
5. **Preparar y cotizar.** El servidor conserva la identidad y propiedad del carrito/comando, contrasta líneas e importes con la instalación y guarda una cotización ligada a ese contexto. Un precio pendiente o una respuesta incierta no se presentan como confirmación.
6. **Elegir cobro.** Efectivo, tarjeta, Bizum y Mixta según configuración. Mixta distribuye el total entre filas de medio/importe y muestra lo restante. La selección de método no prueba una autorización bancaria. Transferencia se retiró de los accesos rápidos, sin borrar histórico o métodos guardados.
7. **Confirmar una sola vez.** La operación conserva su identificador, versión, cotización y evidencias. En las pruebas anteriores el usuario ejecutó el clic financiero final. No duplicar ese efecto mediante SQL o un POST alternativo.
8. **Registrar el pedido remoto.** El adaptador existente envía al PrestaShop seleccionado y conserva pedido, referencia, pagos y estado. No derivar el destino de una constante Hortimatic ni de una tienda fija del navegador.
9. **Releer y conciliar.** Contrastar pedido, líneas, moneda, impuestos, pagos y efecto de stock atribuible. Solo entonces declarar confirmado. La conciliación reconoce el pedido existente; no crea otro por haber perdido la respuesta.
10. **Asentar caja y resultado.** Guardar movimientos propios una sola vez, distinguir efectivo de medios no físicos y permitir documento/reimpresión sin otro cobro.

**Stock:** Central registra el efecto de la venta una vez y PrestaShop descuenta al registrar su pedido. No enviar además una corrección absoluta o un segundo decremento que reproduzca ese efecto. Las ventas online y otros movimientos requieren actualizar la proyección sin deshacer ventas concurrentes. La discrepancia histórica de stock local/nativo sigue pendiente; no se oculta ni se corrige con una resta arbitraria.

**Recuperación:** frente a corte, doble clic, recarga o HTTP incierto, consultar la misma operación y conservar identificadores remotos. Si un pedido ya existe, recuperar su resultado. No cambiar UUID, referencia o carrito para esquivar el diario. Si el servicio acredita que no existe la operación y no se envió venta, reutilizar el retorno al ticket existente conservando líneas; no reenviar automáticamente una solicitud incierta.

**Aparcados:** son borradores, no ventas. Al recuperarlos, comprobar propiedad, versión y vigencia y recalcular. El archivo de un ticket atascado sin pedido conservó historial; no autoriza borrar tickets con efectos financieros ni purgar sus tablas.

## 9. Dependencia instalada y causa de la regresión

La investigación del 22/11 mostró que el recorrido de producción estudiado resolvía `sale.commit` contra el recurso `/api/totus_tpv_sales`, servido por `totuscentralconnector` ya instalado. Por tanto, la afirmación histórica «producción vende exclusivamente mediante la API estándar sin módulo» no quedó acreditada. El usuario autorizó después reutilizar ese recorrido existente.

Esto no autoriza instalar o ampliar conectores. POS TPV/POSTPV y el recurso Totus instalado son dependencias distintas. No retirar ninguna por nombre ni decir que no existe; comprobar consumidores y versión instalada antes de cualquier decisión futura.

Se adaptaron en **preproducción**, no en producción, tres archivos existentes: `NativeOwnedCarts.php`, `NativeCartQuote.php` y `NativeSale.php`. La revisión antigua rechazaba el permiso de venta sin stock y exigía activo. Los cambios conservan identidad, propiedad, cotización, límites y transacción; no modifican `Product.active` ni el núcleo de PrestaShop.

Un fallo posterior de recuperación apareció porque `cart.prepare` podía releerse sin payload y `NativeOwnedCarts.reconcile` no reconstruía ambos permisos. Se reutilizó la alternativa ya existente en la revisión moderna: permiso del payload, después el del propietario, y por último false. El arreglo local y el respaldo de esa instalación están identificados en la sección 4. No reemplazar clases completas sin reconciliar sus versiones.

## 10. Qué está comprobado y qué no

**Aceptado el 22/11:** ventas desde Final a preproducción con pedido registrado; venta partiendo de existencias negativas y venta de un producto desactivado con stock cero, que pasó a negativo sin activarse online. Los identificadores de los pedidos y facturas se mantienen en el anexo privado, no se publican como datos comerciales en GitHub. No repetir ni borrar esas operaciones.

También hay comprobación histórica de catálogo completo, imágenes reales en varias páginas, categorías Inicio/Aromaterapia/Aceites esenciales y aislamiento con una tienda Central. La interfaz compacta, el modal de información y la consulta diferida de costes fueron comprobados en alcances concretos. Esto no termina automáticamente los puntos de configuración, permisos, informes, descuentos o aceptación integral.

Una incidencia anterior de preparación no anula esa aceptación final; tampoco desaparece de la historia. Deben mantenerse las pruebas de recuperación y de pérdida de respuesta que condujeron a la corrección.

No certificado: TPV completamente estable, todo el hardware, todas las operaciones de caja/devolución/crédito, sincronización incremental autónoma, todas las futuras webs, independencia de cualquier módulo instalado, instalador desde base vacía ni promoción a producción.

## 11. Inventario revisado el 25/11

Ambos proyectos Supabase están ACTIVE_HEALTHY y sin ramas de desarrollo. Los recuentos siguientes se obtuvieron mediante COUNT real; no usar las estimaciones de tablas como inventario: algunas estimaciones mostraban cero pese a contener datos.

| Final | Recuento |
|---|---:|
| Productos propios | 5.387 |
| Variantes propias | 2.895 |
| Catálogo local TPV | 7.286 |
| Catálogo nativo importado | 7.280 |
| Proyección de productos web | 5.383 |
| Registros fuente importados | 562.293 |
| Trabajos de importación completados | 5 |
| Ventas locales | 21 |

Los diferentes recuentos tienen alcances distintos; no demuestran duplicación por sí solos. `totus_web_source_records`, de unos 842 MiB con índices/TOAST incluidos, contiene también históricos de pedidos, pagos, movimientos y abastecimiento: no es basura por su tamaño.

La tarea `totus-final-catalogue-pending` está desactivada; no hay bindings de catálogo ni eventos pendientes. El circuito de eventos es candidato a revisión, pero sus tablas tienen referencias desde funciones SQL. No se declara seguro para borrarlo.

Producción conserva datos reales, copias y seis tareas cron activas. Los nombres antiguos que contienen staging no prueban que sean prescindibles. La programación diaria existente de producción no acredita que Final tenga configurada su propia copia diaria a las 00:35 Europe/Madrid.

En el intervalo de las últimas 24 horas consultado el 25/11 hubo llamadas al TPV en ambos proyectos; producción también tuvo uso de conexiones, OneDrive y copias. OneDrive de producción devolvió 22 respuestas 400: hallazgo para el titular, sin arreglos ni escrituras en esta fase.

## 12. GitHub: limpieza y conservación

El 25/11 se eliminó definitivamente el repositorio independiente `hortimatic/Totus-TPV` por autorización expresa. No se eliminó el TPV integrado de Central ni sus servicios/tablas. Se eliminaron también exactamente 14 ramas integradas de Central, preservando el resto de referencias. Hay bundles Git verificados anteriores en `output/limpieza-github-20261125`; no contienen secretos ni toda la configuración/comentarios de GitHub.

Central mantiene 15 ramas. La principal publica producción; la rama TPV del PR213 es antecesora del fuente de Final. Hay otros cuatro PR abiertos y ramas antiguas cerradas o parcialmente reutilizadas. No declarar que todas están integradas. El detalle queda conservado en PENDIENTES_Y_OBJETIVO.md. Esta revisión no autoriza más limpieza de repositorios productivos.

## 13. Protocolo de continuidad

1. Leer README, este relevo y la lista de pendientes de Final; prevalece la instrucción actual del titular sobre planes antiguos.
2. Confirmar el alcance TPV y el aislamiento Final/preproducción. No cambiar producción ni configurar herramientas sobre su base de datos por comodidad.
3. Registrar estado inicial y versión real. Reproducir el punto desde la interfaz propia, con una sola incidencia activa.
4. Buscar el recorrido existente en cliente, servicio y diario antes de editar. No empezar de cero ni crear archivos/servicios/módulos nuevos sin autorización.
5. Aplicar el arreglo mínimo en Final. Si una dependencia compartida exige cambios fuera del TPV, detener ese alcance y explicarlo: no ampliar silenciosamente la tarea.
6. Probar éxito, denegación, respuesta perdida y recuperación según el cambio; verificar no duplicación y regresiones pertinentes de los módulos consumidores.
7. Publicar bloques pequeños exclusivamente en Final, después de sus comprobaciones. Mantener fuente, artefacto y servicio identificados y un retorno seguro.
8. Aceptar desde la interfaz normal; registrar evidencia concreta. No realizar operaciones financieras bloqueadas por otra vía ni usar SQL para simular una identidad.
9. Actualizar los dos documentos y README; una siguiente IA debe poder conocer punto activo, versiones, cambios, pruebas, límites y siguiente paso sin recorrer conversaciones antiguas.

No se documentan claves, contraseñas, service_role, cookies, tokens de administrador, códigos de verificación ni URLs cpsess. Las conexiones legítimas y los permisos de cada herramienta se comprueban, no se crean o amplían a partir de una nota.

## 14. Fuentes y vigencia

Consolidación basada en el paquete del 13/10 y plan del 14/10; manual completo, conexiones, resultados, manifiesto e instrucciones del 31/10; protocolos/idiomas/recorridos de Productos del 07/11; rendimiento y cierres PR190–193; informe POS TPV y memoria/estudio/alcance del 13–15/11; traspaso del 22/11, cola de 36 puntos, objetivo conservado, historial Git y revisión de GitHub/Supabase del 25/11; más las correcciones posteriores del titular en esta conversación.

Los apuntes guardados como respuesta original tienen títulos Plan maestro de transición, Referencia privada para Totus Codex, Primera entrega del Totus TPV, Informe de independencia y instalador y Restauración H verificada. Al intentar abrir el primero desde Fuentes, la interfaz devolvió Inicio, sin el texto original; no se presenta ese contenido como releído. Conservar lo no recuperado hasta poder compararlo, en lugar de inventar su contenido o suponerlo sustituido.

Los originales contables y las capturas de webs son referencias de negocio; los ZIP antiguos son fotografías históricas, nunca un instalador autorizado de Final. Las copias íntegras privadas de los manuales sustituidos deben conservarse fuera de la documentación activa. No publicar el manual antiguo completo: contiene detalles operativos y registros privados que no corresponden a un repositorio público.
