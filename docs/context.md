# Contexto

Decisión de noviembre 2026. Este archivo es la referencia de lo que el sistema va a ser. El detalle de la captura directa está en [decisions/ADR-0003-captura-directa.md](decisions/ADR-0003-captura-directa.md).

## Qué existe hoy

El registro diario sigue en el hub **Finanzas** de Notion. Cuatro bases: Movimientos, Cuentas, Categorías y Presupuestos. En el iPhone, los atajos preguntan monto, categoría y cuenta, y escriben un movimiento con la API de Notion. Esa guía está en [capture-iphone/](capture-iphone/shortcuts.md). Los identificadores de ese hub están en [domain/notion-ids.md](domain/notion-ids.md).

En este repositorio el servidor NestJS ya registra movimientos en memoria: alta, lista, consulta, edición, borrado, filtros y saldo. No hay base de datos. Al reiniciar, la lista queda vacía.

[Plan Financiero](https://app.notion.com/p/305f454b5630808bb33ddd0fbf6d25c4) sigue aparte: metas, reglas y seguimiento anual. Este sistema es el registro de ingresos y gastos.

## Qué será

El atajo envía el formulario a la API. La API lo guarda en PostgreSQL.

```text
Atajo del iPhone (formulario de ingreso o gasto)
    → HTTP POST con JSON
    → API NestJS, POST /transactions
    → PostgreSQL
```

La dirección de este tramo es el teléfono hacia la API, y la API hacia su base. Notion deja de ser la fuente que la aplicación lee. El hub que ya existe no se borra: deja de ser el paso por el que tiene que pasar un movimiento nuevo.

## Qué se conserva

- Moneda **COP**. Valor siempre positivo. El tipo dice si es ingreso o gasto.
- Catálogo corto. Subcategorías quedan fuera.
- Concepto puede faltar en la captura rápida. La fecha es el día del movimiento.
- El saldo y, más adelante, el presupuesto del mes se calculan desde los movimientos guardados.
- Plan Financiero permanece fuera.

La forma de las bases de Notion sigue descrita en [domain/data-model.md](domain/data-model.md). Es el mapa del hub actual, no el contrato del `POST`.

## Qué dejan los sprints siguientes

Estos objetivos de octubre salen del plan cercano:

- Leer Movimientos, Cuentas, Categorías y Presupuestos desde Notion.
- Reescribir cada página en la base de la aplicación.
- Guardar el `page_id` y una constancia cuando esa página cambie.

El orden que los reemplaza está en [roadmap.md](roadmap.md): primero PostgreSQL, después el JSON que el atajo puede enviar, después apuntar el atajo a la API.

## Fuera de este tramo

- Subcategorías, transferencias como tipo propio y saldo de cuenta en tiempo real.
- Clasificación automática y recordatorios.
- Convertir Plan Financiero en parte de la aplicación.
- Copiar el historial que ya está en Notion.
- Autenticación y publicación del POST con datos reales.

## Dónde está cada cosa

| Documento | Rol |
| --- | --- |
| [context.md](context.md) | Esta decisión |
| [architecture.md](architecture.md) | Atajo, API y PostgreSQL |
| [roadmap.md](roadmap.md) | Qué está hecho y qué sprint sigue |
| [decisions/ADR-0003-captura-directa.md](decisions/ADR-0003-captura-directa.md) | Por qué la captura ya no pasa por Notion |
| [domain/data-model.md](domain/data-model.md) | Forma de las cuatro bases del hub actual |
| [domain/notion-ids.md](domain/notion-ids.md) | Ids de ese hub |
| [capture-iphone/](capture-iphone/shortcuts.md) | Cómo capturan hoy los atajos, todavía contra Notion |
| [development/workflow.md](development/workflow.md) | Ramas, commits y la clave PER |
