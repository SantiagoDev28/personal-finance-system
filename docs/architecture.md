# Arquitectura objetivo

La aplicación web es el sistema. Notion es la fuente que se consume. La base de la aplicación es el archivo permanente de ingresos y gastos.

```text
┌─────────────────────────────────────────┐
│  Aplicación web (NestJS, hecha a mano)  │
│  Lee Notion y muestra el registro       │
└──────────────────┬──────────────────────┘
                   ▼
┌─────────────────────────────────────────┐
│  Ingesta                                │
│  Movimientos, cuentas, categorías,      │
│  presupuestos                           │
└──────────────────┬──────────────────────┘
                   ▼
┌─────────────────────────────────────────┐
│  Base permanente                        │
│  Cada movimiento reescrito, con origen  │
│  y rastro si el dato cambia             │
└─────────────────────────────────────────┘

Fuente externa: hub Finanzas en Notion
Brújula aparte: Plan Financiero
```

| Capa | Responsabilidad |
| --- | --- |
| Web | Servir el registro de ingresos y gastos. Se construye en NestJS, desde cero, en este repositorio. |
| Ingesta | Leer las bases de Notion y reescribir cada movimiento en la base propia. |
| Base permanente | Guardar el historial de forma durable y trazable. |
| Notion | Seguir siendo el origen de los datos que la aplicación consume en este tramo. |
| Plan Financiero | Metas y reglas. Permanece fuera de este registro. |

El flujo de datos de este tramo va de Notion hacia la base de la aplicación. El contexto completo está en [context.md](context.md).

## Reglas de dominio que la ingesta respeta

- Valor positivo. El tipo (`Gasto` o `Ingreso`) distingue el movimiento.
- Categoría y cuenta llegan como relaciones de Notion. Se guardan el id de origen y el nombre.
- Moneda COP.
- Un movimiento de Notion (`page_id`) corresponde a un registro permanente identificable. Si Notion cambia, queda constancia; el historial no se sustituye en silencio.
- Los ids canónicos están en [domain/notion-ids.md](domain/notion-ids.md). El modelo de las bases está en [domain/data-model.md](domain/data-model.md).

## Captura actual

Los atajos del iPhone escriben en la base Movimientos con `POST /v1/pages`. Ese canal explica cómo nacen muchas filas. La descripción está en [capture-iphone/shortcuts.md](capture-iphone/shortcuts.md) y [capture-iphone/capture-flow.md](capture-iphone/capture-flow.md). La aplicación lee el resultado ya guardado en Notion.

## Seguridad

- El token de la integración vive fuera del repositorio (`.env` está en `.gitignore`).
- El hub Finanzas es un borrador privado.
- La aplicación, cuando exista, usa el token en el servidor. El token no viaja al navegador ni se documenta en los atajos como lugar definitivo.
