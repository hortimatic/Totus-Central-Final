> Actualización documental · 26/11/2026. La entrega canónica está en **OneDrive → Apps → TotuscentralStudio** y en **Fuentes** del proyecto. Los caminos locales `output/...` de la procedencia histórica ya no son ubicaciones de trabajo vigentes. Producción permanece protegida; este cambio no modifica código ejecutable, SQL, servicios ni configuración.

# Pendientes y objetivo conservado — Totus Central Final

Actualizado: **25/11/2026, Europe/Madrid**. Leer junto a RELEVO_Y_RECORRIDOS.md.

## 1. Alcance actual y estado del objetivo

El objetivo general no está completado. El titular lo mantiene en pausa y ahora limita el desarrollo a **TotusTPV en Final**, con producción intocable y el resto de módulos de Final protegido. Esta revisión solo documenta; no reanuda tareas de implementación ni la limpieza global.

Estado técnico leído de la herramienta del objetivo: `usageLimited`; su contenido remite al archivo de objetivo histórico. Ese estado no equivale a objetivo terminado ni a autorización para modificar su estado. La pausa funcional y la restricción actual se conservan aquí como instrucciones del titular.

Objetivo de producto conservado: Central como sistema principal de gestión, datos iniciales absorbidos por web y cambios posteriores sincronizados; TPV integrado que registra una venta una sola vez y crea el pedido en el PrestaShop elegido; stock coherente sin doble descuento; incorporación autónoma de futuras webs, incluidas webs sin caja/TPV; uso de recorridos ya construidos, estabilidad, claridad, limpieza e historial recuperable. No sustituir lo existente por caminos nuevos sin permiso.

La futura promoción a producción y el trabajo con PrestaShop actualizados son fases posteriores, no autorizaciones de despliegue actuales. No instalar, ampliar ni retirar módulos por interpretar una preferencia antigua como permiso vigente.

## 2. Cómo se interpreta la lista

- **Aceptado en alcance concreto:** hay evidencia o aceptación del titular para ese caso; no significa módulo completo ni prueba reciente repetida.
- **Parcial:** existe una parte comprobada y queda alcance explícito.
- **Pendiente:** no hay cierre suficiente documentado.
- **En pausa:** se conserva la petición, pero queda fuera del desarrollo TPV actualmente autorizado.

Se conservan los números 01–36 para enlazar las notas anteriores. La actualización final del 22/11 prevalece sobre los estados de fallo anteriores de las mismas ventas. No reabrir ventas aceptadas ni repetir pedidos para producir una evidencia nueva.

## 3. Cola histórica completa, actualizada

| Nº | Petición y trabajo restante | Estado actual / alcance |
|---|---|---|
| 01 | Catálogo persistente por web/tienda, carga inicial completa y actualización de cambios sin volver a descargar todo al entrar. Preservar idiomas, variantes, imágenes, precios y recuperación. Revisar el circuito de eventos desactivado antes de retirarlo o reutilizarlo. | **Parcial.** Hay catálogo e importaciones persistidas. Automatización incremental general no aceptada. Atender ahora solo lo necesario para el TPV. |
| 02 | Inicio: tarjetas compactas, simétricas, desplazamiento sin captura de rueda, datos/cobros/documentos/calendario/estado completos. | Pendiente, **en pausa**; conservar funcionamiento. |
| 03 | Chat: canales y secciones, compositor, Ctrl+K/cambio de conversación y tamaño de filtros/controles. | Pendiente, **en pausa**. |
| 04 | Ventas: eliminar vista simplificada duplicada y selector redundante Webs conectadas; conservar una vista completa y contexto claro. | Pendiente, **en pausa**. |
| 05 | Ventas: margen en euros y porcentaje, ticket medio y KPI del mismo tamaño; no fabricar costes/margen desconocidos. | Pendiente, **en pausa**. |
| 06 | Precio: investigar carga de productos al elegir Hortimatic, filtros, selección, acciones y presentación completa. | Pendiente, **en pausa**; no reemplazar Pricing. |
| 07 | TPV: detectar y configurar web, tienda y cajas usando el asistente existente; repetir con futuras webs sin intervención de desarrollador. | **Parcial.** Preparación/asignación de preproducción comprobada. Autonomía para toda web futura no aceptada. |
| 08 | Inicio TPV: acceso claro a tienda/caja, configuración general y administración sin recorridos innecesarios. | **Parcial.** Inicio TPV y Más acciones recuperados. Falta aceptación integral de entrada/cambio/salida. |
| 09 | TPV Caja/Gestión diaria/Pedidos: contenidos coherentes, sin duplicaciones; abrir, recuperar, cambiar puesto, arquear y cerrar. | Pendiente de aceptación integral. Mantener las rutas existentes en el menú secundario. |
| 10 | Permisos de Administrador para Smok y Vape: vender, abrir, arquear/cerrar; comprobar persistencia y elección por interfaz. | **Parcial.** Autorización histórica expresa conservada; no extenderla a otros roles ni volver a pedirla para esas mismas acciones. |
| 11 | Categoría Inicio y jerarquía real de PrestaShop, categoría inicial configurada y subcategorías hijas; productos correctos al seleccionar. | **Parcial.** Inicio y varias jerarquías comprobadas el 22/11. Falta aceptación general tras recarga/cambio de web/caja y cada forma de navegar. |
| 12 | Todos los productos y variantes del catálogo; evitar el filtro incorrecto de activos que reducía el listado. | **Aceptado en alcance concreto:** 5.383 productos / 7.280 artículos nativos en la prueba histórica. No confundir con recuentos propios posteriores de Central ni con todas las futuras webs. |
| 13 | Imágenes reales por origen y contexto en varias páginas, sin usar un icono sustituto como prueba de carga. | **Aceptado en alcance concreto:** fotos reales verificadas en páginas 1 y 2. Conservar regresión de cambio de tienda/caché. |
| 14 | Configuración TPV completa; ticket aprovechable, controles y etiquetas compactos, escritorio/intermedio/móvil. | **Parcial.** Hay compactación publicada; no están aceptados todos los apartados ni todas las anchuras. |
| 15 | Ajustes: estados, medios de pago, cobro, crédito, recargos y ayudas `i` comunes; sin recortes/solapamientos. | Pendiente de revisión integral del TPV. |
| 16 | Pedidos/devoluciones: alinear búsqueda, referencia y sesión; consulta, reimpresión y devolución, estados vacíos compactos. | Pendiente de aceptación real completa. |
| 17 | Todos los recorridos TPV: operador/tienda/caja, cliente, variantes, cantidades, cobro, aparcados, devoluciones, movimientos, cierre, permisos, errores y recuperación. | **Parcial.** Venta a preproducción aceptada para los casos documentados; no está completada toda esta matriz. |
| 18 | Flechas de ordenación comunes y correctas para número, fecha, importe y texto, incluida ID de Clientes. | **Parcial.** Flechas de Clientes verificadas en un alcance. La revisión global de tablas queda en pausa; proteger componentes compartidos. |
| 19 | Productos: filtros estables al cambiar Hortimatic/Central; ancho, distribución y contexto sin desplazamientos. | Pendiente, **en pausa**. |
| 20 | Categorías/subcategorías de Productos: presentación, jerarquía, creación/edición y sincronización por web. | **Parcial, en pausa.** Guardado/sincronización explícitos comprobados; automatización y rediseño no cerrados. No mezclarlo con el filtro del TPV del punto 11. |
| 21 | Retirar categorías de prueba 135 y 136 expresamente autorizadas. | **Verificado históricamente.** No repetir ni extender ese permiso a otro borrado. |
| 22 | Productos/Copiar: reutilizar la interfaz madura, destino web o tienda física, idiomas, imágenes, combinaciones, maestros y revisión. Quitar supuestos de solo dos webs en textos y encargos. | Pendiente, **en pausa**. Conservar cambios validados y diarios. |
| 23 | PrestaShop: selector común de tienda y todas las pestañas/acciones con contexto correcto. | Pendiente, **en pausa**. |
| 24 | Clientes/Proveedores/Marcas: una vista completa, títulos y selector común, sin perder edición nativa. | **Parcial, en pausa.** Vista única/selector comprobados; falta repaso completo. |
| 25 | Roles y permisos: módulos, pestañas y acciones nuevos/antiguos; interfaz coherente con autorización de servidor. | Pendiente, **en pausa**. En TPV verificar las operaciones afectadas sin ampliar permisos globales por defecto. |
| 26 | Almacenamiento real de servicios y aislamiento de Final, capacidades/uso sin cifras inventadas. | Pendiente, **en pausa**. Inventario del 25/11 documentado; no equivale a integración completa de la pantalla. |
| 27 | Copia propia de Final diaria a las 00:35 Europe/Madrid, destino y ejecución sin navegador abierto; comprobar restaurabilidad. | Pendiente, **en pausa**. No confundir cron/copia de producción con configuración de Final ni con recordatorio de una IA. |
| 28 | Datos de las webs organizados por origen y finalidad; coherencia entre directorios, Productos, Precio, Ventas y TPV. | **Parcial.** Hay persistencia e importaciones. La organización global queda en pausa; el contexto del TPV debe conservarse. |
| 29 | Selector de pagos compacto; renombrar Efectivo y otro medio a Mixta; retirar Transferencia de accesos rápidos y eliminar desbordes. | **Parcial.** Nombre Mixta y compactación/retirada de acceso rápido publicados. Comprobar tamaños y métodos autorizados sin borrar historial. |
| 30 | Estudiar y reutilizar los recorridos heredados de Central y las webs; no rehacer la venta. Conservar el TPV→pedido y preparar futuras webs. | **Parcial.** Recorrido remoto recuperado y ventas aceptadas. La suposición de ausencia de módulo fue refutada para el circuito inspeccionado. Futuras webs e independencia de dependencias requieren aceptación separada. |
| 31 | Mixta: modal sencillo con restante, filas de medio/importe y Añadir pago; suma y referencias exactas. | Pendiente de aceptación completa por interfaz y resultado remoto; no basta el nombre del botón o pruebas simuladas. |
| 32 | Ficha `i`: modal, imagen, descripción corta/larga, stock por tienda, coste sin impuestos/con IVA/con IVA+RE y margen estimado. | **Parcial.** Modal y consulta diferida recuperados; un ejemplo de costes comprobado. Cobertura de descripciones, multitienda y todos los orígenes no cerrada. |
| 33 | Descuentos: códigos, vigencia, reducción, aplicación al ticket y relación con el pedido. | Pendiente de aceptación completa. Reutilizar herramientas existentes; no otro editor de precios permanente. |
| 34 | Informes TPV: periodos, físico/online, factura, empleado, moneda, resumen/pedidos/productos/pagos, impuestos/coste/beneficio y exportaciones. | Pendiente de aceptación completa. No reutilizar datos estimados como resultado fiscal o neto garantizado. |
| 35 | Servidor: inventariar CoreDesk, coredesk_public y migration-hortimatic-20261112 / migration-newoldsmok-20261118; residuos/temporales sin borrar servicios o recuperación. | Pendiente, **en pausa**. No se ha demostrado que esas carpetas estén sin uso. |
| 36 | Limpieza de código, zonas de trabajo, GitHub, Supabase y OneDrive identificando consumidores, datos y respaldos. | **Parcial, en pausa para más cambios.** Repositorio Totus-TPV y 14 ramas integradas eliminados con autorización. Revisión restante de GitHub/Supabase solo de lectura; sin autorización implícita para purgar nada más. |

## 4. Peticiones posteriores: no perderlas dentro de los 36 puntos

| ID | Petición / criterio de aceptación | Estado |
|---|---|---|
| T01 | Venta sin stock configurable solo en TPV; permitir negativo y conservar la política online. El servidor aplica la misma opción que la interfaz. | **Aceptado para preproducción el 22/11.** Mantener pruebas y recuperación; no dar por válida toda instalación futura. |
| T02 | Venta de producto desactivado desde TPV sin activar el artículo online, y sin stock si ambas opciones lo permiten. | **Aceptado para el caso documentado el 22/11.** No sustituir esa evidencia por el fallo anterior de preparación. |
| T03 | Discrepancia de existencias Central/nativo: se observó un artículo con −22 local frente a −17 nativo antes de vender. Reconciliar proyección, origen y movimientos sin doble descuento. | **Pendiente importante.** No ajustar valores arbitrariamente ni afirmar que los stocks ya coinciden. |
| T04 | Controlar datos de webs online sin caja ni TPV; selector de modalidad y datos visibles fuera del TPV. | Pendiente del objetivo global, **en pausa**. Conservar compatibilidad al tocar el TPV. |
| T05 | Categoría inicial configurable: la elegida aparece en la barra y sus hijas debajo; el filtro muestra los productos correspondientes respetando asociaciones nativas. | Parcial; enlaza con 11. No equiparar categoría por defecto con todas las categorías asociadas. |
| T06 | Elegir en configuración qué se muestra en tarjetas: unidades/stock, nombre, referencia, precio, imagen e información adicional; persistencia por cuenta/contexto. | Parcial. Unidades visibles en algunos casos; falta aceptación completa de opciones y recarga. |
| T07 | Cabecera: tienda/caja a izquierda, Inicio TPV y Más acciones a derecha. Eliminar Venta redundante y botones duplicados; Caja/Configuración/Gestión diaria y presupuesto en menú existente. | Parcial; composición publicada, falta repaso global sin romper salida ni ticket. |
| T08 | Reducir pie de ticket, paginación, categoría y Vista; alturas homogéneas, no cada caja de un tamaño. Quitar aviso de catálogo del espacio de venta. | Parcial; compactación publicada. Verificar varios tamaños, más líneas y teclado. |
| T09 | Información de costes y margen: coste base, IVA y RE configurado. El 5,2% fue una regla de negocio solicitada, no una ley universal; comprobar política y origen. | Parcial. Beneficio estimado del artículo, antes de gastos generales; no llamarlo neto contable garantizado. |
| T10 | Ticket aparcado atascado: poder recuperarlo/archivarlo desde interfaz sin borrar operaciones con pedido. | Ticket concreto archivado y aceptado; **mejora general de interfaz pendiente**. No purgar tablas de borradores. |
| T11 | Futuras webs: configuración guiada de API/capacidades, tienda, cajas, operadores y medios usando el asistente heredado; sin SQL manual ni intervención de una IA. | Parcial. Asistente existente accesible y preproducción configurada; falta aceptar otra instalación completa y fallos. |
| T12 | Relevo en Final: README, historia/recorridos y pendientes al día; Fuentes sin instrucciones activas contradictorias. | **Esta entrega documental.** No implica cerrar los puntos funcionales ni el objetivo. |

## 5. Orden de reanudación propuesto dentro del alcance TPV

No hay una implementación activa durante esta entrega documental. Para una futura reanudación, conservar un único punto activo y no saltar a otro módulo:

1. Preservar la venta aceptada y resolver la coherencia de stock/proyección (T03), junto con la recuperación de operación incierta.
2. Cerrar navegación/categoría inicial/filtro (11/T05), configuración de presentación y compactación (T06–T08) sin alterar el checkout.
3. Cerrar permisos, entrada/cambio de puesto, aparcados y matriz de caja (07–10, 14–17, T10).
4. Mixta, información de artículo, descuentos e informes (29–34), con resultado persistido y remoto donde corresponda.
5. Configuración repetible para futuras webs y aceptación del conjunto aplicable (07/30/T11), sin instalar caminos paralelos.

Dentro de cada bloque se pueden agrupar arreglos pequeños compatibles en una publicación de Final después de verificarlos. La limpieza global y las mejoras de otros módulos no se reanudan por terminar un bloque de TPV.

## 6. Puertas de aceptación que siguen abiertas

- Exactamente un pedido/pago/asiento por venta frente a doble clic, recarga, respuesta perdida, caducidad y dos puestos concurrentes.
- Stock local y nativo conciliado según movimientos; una devolución o sincronización no repite ni deshace el descuento del pedido.
- Mixta, cambios y redondeo; crédito/anticipos y pagos posteriores solo cuando estén realmente implementados y aceptados.
- Aparcados, presupuesto/conversión, devolución parcial/total, reintegro/vale, reposición y reimpresión con límites e identidades propios.
- Apertura/cierre, movimientos, recuento y separación efectivo/tarjeta/Bizum; cambio de operador y revocación de acceso.
- Catálogo, imágenes, variantes, idiomas y categorías por web; consultas rápidas con datos persistidos y precios autorizados antes del efecto financiero.
- Impresión, cajón, lector, táctil y pantalla de cliente con hardware real; fallo de impresora no repite el cobro.
- Aislamiento de producción/Final y de webs/cajas/usuarios, además de regresiones pertinentes del resto de módulos protegidos.
- Configuración autónoma desde la herramienta e incorporación de una web distinta sin constantes particulares ni intervención manual de desarrollador.

Ni las pruebas Node/PHP/PGlite/Playwright ni un workflow success sustituyen la aceptación de esos recorridos reales. La confirmación financiera final de una prueba debe respetar los límites de la herramienta y la intervención del usuario cuando corresponda.

## 7. Revisión de las 15 ramas de Central: referencia, sin nuevas retiradas

| Rama | Resultado del 25/11 |
|---|---|
| `totus-central` | Publica producción; conservar y no modificar. |
| `feat/totustpv-stock-receipts-20261116` | PR213 abierto; antecesora del fuente Final actual. Conservar. |
| `feature/dynamic-websites-onboarding-20261113` | PR194 abierto; cambios propios de incorporación de webs. |
| `fix/prestashop-existing-variant-images-20261107` | PR146 abierto; cambios propios de imágenes. |
| `fix/prestashop-orders-caja-20261111` | PR181 abierto; cambios propios de atribución a caja. |
| `ops/argus-p3-vaperalia-assets-20261107` | PR145 abierto; operación temporal, retirar solo si se confirma su cierre y ausencia de consumidores. |
| `design/stitch-inicio-profesional-20261110` | PR168 cerrado sin integrar; documentación de diseño, candidata a archivo/retirada. |
| `feat/tpv-static-pages-qa-20261115` | PR204 cerrado sin integrar; TPV independiente de prueba, candidato a retirada controlada. |
| `feature/prestashop-readonly-config-20261103` | Propuesta antigua sustituida; cambios propios no integrados literalmente. |
| `fix/restore-original-inicio-keep-prestashop-20261110` | PR167 cerrado sin integrar; alternativa antigua. |
| `fix/shared-interface-controls-20261115` | PR201 cerrado sin integrar; revisar cambios antes de retirar. |
| `fix/prestashop-webservice-permissions-20261106` | PR134 cerrado; cinco cambios equivalentes y uno propio de CI. |
| `fix/chat-screen-fit` | PR88 integrado, pero la rama recibió cambios posteriores; no está completamente integrada. |
| `fix/chat-viewport-verification` | PR89 integrado; dos cambios sin equivalente detectado, uno equivalente. |
| `feat/inicio-plantillas-compartidas-20261111` | Tres cambios equivalentes y cuatro propios; no declarar sobrante completa. |

Las ramas son referencias históricas, no despliegues independientes acreditados. No fusionar propuestas antiguas para resolver el TPV sin revisar sus cambios contra Final. La copia Git conserva historia; no permite afirmar que sus PR, secretos o configuración completa estén respaldados.

## 8. Supabase: qué conservar y qué revisar

**Conservar ambos proyectos.** Producción tiene datos reales y trabajos activos; Final tiene datos maestros, catálogo, ventas, diarios, configuración y recuperación. Ninguno tiene ramas de desarrollo sobrantes.

Conservar `totus-tpv` en ambos. El repositorio independiente eliminado no equivale al servicio del TPV integrado. Mantener conexiones, OneDrive, copias, recuperación y administración: varios tienen consumidores y algunos son de uso ocasional.

Candidatos a revisión, sin permiso de borrado:

- Circuito Final de eventos de catálogo: tarea desactivada, bindings/eventos vacíos, pero funciones SQL dependientes. Inventariar consumidores antes de una retirada completa.
- Historial cron de producción: unos 104 MiB y tarea de retención ya existente. No ejecutar limpieza sobre producción en esta fase.
- Registros fuente importados: unos 842 MiB y 562.293 filas reales. No son residuos acreditados. Estudiar necesidad de recursos/históricos y retención sin destruir la importación base.
- Respuestas 400 de OneDrive en producción: incidencia observada, fuera del alcance de arreglo actual.
- Estadísticas estimadas de tablas de Final desactualizadas: no etiquetar una tabla como vacía antes de contar y comprobar dependencias. Esta revisión no ejecutó ANALYZE ni mantenimiento.

Los avisos históricos de seguridad/RLS y de contraseñas filtradas no se consideran resueltos por esta revisión. Hace falta auditoría específica antes de afirmarlo; no cambiar permisos o protecciones por limpiar el esquema.

## 9. Requisitos anteriores recuperados de las Fuentes, fuera del alcance activo

El plan del 05/11 y el manual del 31/10 contienen peticiones que no deben perderse al sustituir sus archivos. Son antecedentes a contrastar; no se afirman todas pendientes ni todas resueltas sin aceptación más reciente. **Quedan en pausa**:

| ID | Necesidad histórica conservada |
|---|---|
| H01 | Plantillas Stitch completas y fieles a referencia; estilos por usuario con guardar, aplicar, restaurar, duplicar, renombrar e importar/exportar. Conservar navegación, accesibilidad y controles existentes. |
| H02 | Consultar cierres ya realizados en el origen e importarlos a Cajas sin duplicados; distinguir apertura de fecha real de cierre, efectivo retenido, venta, retirada y abono bancario. El plan antiguo de lectura de cierres no limita ni sustituye el TPV integrado posterior. |
| H03 | Ticket a borrador/factura de Totus: tienda, cliente, impuestos, descuentos, logo y serie del titular correctos; vínculo al origen y sin duplicar ingresos, documentos o céntimos. |
| H04 | Recepciones: mismo registro y originales para cotejo con reglas o IA; equivalencias confirmadas y persistentes, cantidades por pack, revisión/recarga. Conservar los ejemplos históricos y resolver errores del proveedor sin fabricar coincidencias. No convertir un cotejo en un movimiento de stock. |
| H05 | Consultas programadas con filtros, periodos, zona Madrid, destino, historial y pausa; aviso de pedidos nuevos sin duplicados ni confundir un recordatorio de texto con consulta ejecutada. No activar envíos al Chat por redactar esta lista. |
| H06 | Pestañas paralelas y refresco al entrar en módulos conservando borradores/filtros; respuestas tardías de otra sesión descartadas. APIs de servicio sin usuarios innecesarios; asistentes con identidad propia y contrato instalado. |
| H07 | Traslado a infraestructura propia: inventario de web, backend, Auth, Storage, RLS, Cron, documentos y copias; exportación/restauración aislada y reversible. No se ejecuta el traslado ni se contrata alojamiento. |
| H08 | Producto genérico para otras empresas: separación de empresas, tiendas, fiscalidad, series, marca y conexiones; instalador/base vacía y autonomía de alta. No se certifica listo para comercialización. |
| H09 | Productos: preservar idiomas instalados incluso inactivos, completar contenido/SEO/relaciones por destino y verificar etapas. Incidencias antiguas de imágenes de muestras y selector de color del tema deben contrastarse; no se consideran arregladas por tener combinaciones correctas en API. |
| H10 | Importación masiva de gastos con plantilla, mapeo, validación previa, duplicados, lote y errores; exportaciones XLSX/PDF/ZIP abiertas y contrastadas con originales. No modificar originales fiscales ni asociar facturas solo por importe. |

No aplicar automáticamente los SQL o las instrucciones de instalación que acompañaban a esos documentos históricos. Su conservación permite contrastar el requisito cuando se autorice reanudar el área correspondiente.

## 10. Cierre de cada siguiente entrega

Registrar fecha, punto activo, fuente/artefacto/servicio, archivos cambiados, datos afectados, pruebas aisladas, aceptación por interfaz, limitaciones, retorno seguro y siguiente paso. Dejar explícito si no se modificó producción y si el resto de módulos conservó sus recorridos.

No marcar el objetivo completo por agotarse el presupuesto, detenerse o publicar un lote. No perder los puntos en pausa ni convertir la lista histórica en permiso para ejecutar todas sus acciones ahora.
