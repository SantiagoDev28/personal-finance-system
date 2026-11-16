# Arquitectura

La API NestJS es el sistema. El atajo del iPhone le envía el movimiento. PostgreSQL es el archivo permanente.

La decisión está en [decisions/ADR-0003-captura-directa.md](decisions/ADR-0003-captura-directa.md) y el sprint siguiente en [decisions/ADR-0005-atajo-a-la-api.md](decisions/ADR-0005-atajo-a-la-api.md). El contexto está en [context.md](context.md).

```text
Atajo del iPhone
Formulario de ingreso o gasto
        ↓
HTTP POST + JSON
        ↓
API NestJS
POST /transactions
        ↓
PostgreSQL
Almacenamiento persistente
```

| Capa | Responsabilidad |
| --- | --- |
| Atajo | Preguntar el movimiento y enviarlo como JSON a `POST /transactions`. El sprint siguiente reemplaza el envío a Notion. |
| API | Validar y registrar el ingreso o el gasto. NestJS, en este repositorio. También lista, edita, borra, filtra y calcula el saldo. |
| PostgreSQL | Guardar el registro. La tabla sale de las migraciones. El saldo no es una columna. |
| Notion | Hub ya existente. La aplicación no lo lee ni copia sus filas. |
| Plan Financiero | Metas y reglas. Permanece fuera de este registro. |

## Qué ya hace la API

El módulo de movimientos guarda cada fila en PostgreSQL.

- Alta en `POST /transactions`.
- Lista, consulta por id, edición y borrado.
- Filtro por tipo, categoría y rango de fechas. El rango está en [ADR 0002](decisions/ADR-0002-rango-de-fechas.md).
- Saldo calculado desde los movimientos, no guardado aparte. Moneda COP y peso entero, en [ADR 0001](decisions/ADR-0001-dinero-moneda-y-fecha.md).

## Captura de hoy

Los atajos instalados hoy todavía escriben en la base Movimientos de Notion con `POST /v1/pages`. Esa descripción está en [capture-iphone/shortcuts.md](capture-iphone/shortcuts.md) y [capture-iphone/capture-flow.md](capture-iphone/capture-flow.md). El sprint siguiente los apunta a la API. El plan de programación es el dibujo de arriba.

## Seguridad

- El token de Notion, mientras el atajo viejo siga en uso, vive fuera del repositorio (`.env` está en `.gitignore`).
- El hub Finanzas es un borrador privado.
- El POST de la API no se publica con datos reales hasta que haya autenticación.
