# Contexto

Decisión de octubre 2026. Este archivo es la referencia de lo que el sistema va a ser. El detalle operativo de hoy está en las carpetas vecinas.

## Qué existe hoy

El registro diario vive en el hub **Finanzas** de Notion. Cuatro bases: Movimientos, Cuentas, Categorías y Presupuestos. En el iPhone, tres atajos preguntan monto, categoría y cuenta, y escriben un movimiento con la API de Notion. El hub muestra el resumen.

Ese conjunto ya está creado y es la fuente que la aplicación va a consumir. La guía toque a toque de los atajos queda en [capture-iphone/](capture-iphone/shortcuts.md). Los identificadores canónicos están en [domain/notion-ids.md](domain/notion-ids.md).

[Plan Financiero](https://app.notion.com/p/305f454b5630808bb33ddd0fbf6d25c4) sigue aparte: metas, reglas y seguimiento anual. Este sistema es el registro de ingresos y gastos.

## Qué será

Una aplicación web, construida casi por completo a mano. El servidor se crea con **NestJS desde cero** en este repositorio, cuando se pida. Este paso no incluye código.

La web consume los datos de Notion y los reescribe en su propia base de datos. Esa base es el archivo permanente. Notion sigue siendo el lugar de donde salen los movimientos, las cuentas, las categorías y los presupuestos. La aplicación guarda una copia durable y puede seguir cada ingreso y cada gasto hasta su origen.

```text
Notion (fuente)
    → la web lee movimientos, cuentas, categorías y presupuestos
    → reescribe cada movimiento en la base propia
    → lo guarda de forma permanente
    → cada ingreso y cada gasto queda trazable
```

La dirección de este tramo es Notion hacia la base de la aplicación. La web es quien persiste. El hábito de captura en el teléfono describe cómo entran los datos hoy; la pieza a programar es la aplicación.

## Trazabilidad

Cada movimiento reescrito tiene que poder responder, más adelante, de dónde salió y qué era:

- Identidad propia en la base permanente, más el `page_id` de Notion del que provino.
- Tipo: ingreso o gasto. El valor se guarda positivo; el tipo dice el signo. Así se conservan la regla de Notion y la fórmula `Impacto`.
- Fecha, concepto, categoría y cuenta, con los nombres y los ids de origen.
- Momento en que la aplicación lo leyó y lo guardó.
- Si el origen cambia después, el registro permanente conserva constancia del cambio. Una corrección no desaparece el movimiento anterior sin dejar rastro.

Ingresos y gastos se guardan como movimientos distinguibles. Un total del mes se puede recalcular; el movimiento que lo compone sigue localizable.

## Qué se conserva del modelo

El contrato de datos actual sigue vigente como forma de lo que hay que leer. Está descrito en [domain/data-model.md](domain/data-model.md).

- Moneda **COP**.
- Valor siempre positivo. `Tipo` es `Gasto` o `Ingreso`.
- Cuenta es una relación (Nequi, Bancolombia, efectivo…), no un select duplicado.
- Catálogo corto: 10 categorías de gasto y 3 de ingreso. Subcategorías quedan fuera.
- Concepto, necesidad y notas pueden faltar en la captura rápida. Fecha por defecto: el día del movimiento.
- Presupuesto es una categoría más un mes. En Notion, `Gastado` no es un rollup mensual; la base propia sí podrá calcular el mes a partir de los movimientos guardados.
- Los ids de bases, cuentas y categorías de [domain/notion-ids.md](domain/notion-ids.md) son la lista canónica. La guía de atajos tiene desfaces locales en el menú de cuentas (atajo de gasto incompleto; Nequi y «Transferencia» comparten id). Al ingerir, manda el id de Notion, no la etiqueta del atajo.

## Qué describe la carpeta del iPhone

[capture-iphone/](capture-iphone/shortcuts.md) documenta el canal que escribe en Notion ahora: widget de Atajos, `POST /v1/pages`, tres preguntas, notificación. Sirve para entender el payload y el hábito. La aplicación web es el sistema que se va a construir encima de esos datos.

## Límites que la aplicación absorbe

Notion sigue teniendo estos límites. La base permanente existe, entre otras razones, para no depender de ellos al consultar el historial:

- Un rollup no filtra por mes.
- El widget nativo de Notion abre una página; no registra un movimiento.
- Una integración solo ve las páginas a las que está conectada: Movimientos, Cuentas y Categorías (y Presupuestos cuando se lean).
- El token de la integración no entra al repositorio.

## Fuera de este tramo

- Código, esquema de tablas y elección del motor de base. Se deciden al crear el proyecto NestJS.
- Subcategorías, transferencias como tipo propio y saldo de cuenta en tiempo real.
- Clasificación automática y recordatorios.
- Convertir Plan Financiero en parte de la aplicación.

## Dónde está cada cosa

| Documento | Rol |
| --- | --- |
| [context.md](context.md) | Esta decisión |
| [architecture.md](architecture.md) | Capas de la web, Notion y la base permanente |
| [roadmap.md](roadmap.md) | Orden para empezar NestJS desde cero |
| [domain/data-model.md](domain/data-model.md) | Forma de las cuatro bases |
| [domain/notion-ids.md](domain/notion-ids.md) | Ids para leer Notion |
| [capture-iphone/](capture-iphone/shortcuts.md) | Cómo capturan hoy los atajos |
| [development/workflow.md](development/workflow.md) | Ramas, commits y la clave PER |
