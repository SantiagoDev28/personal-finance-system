# Roadmap

El servidor NestJS ya registra movimientos en memoria. PostgreSQL todavía no está. El camino de los sprints siguientes es el de [decisions/ADR-0003-captura-directa.md](decisions/ADR-0003-captura-directa.md): el atajo del iPhone hace `POST` a la API y la base guarda el movimiento.

```text
Atajo del iPhone
    → HTTP POST + JSON
    → API NestJS, POST /transactions
    → PostgreSQL
```

Hoy el tercer paso vive en memoria. El atajo todavía escribe en Notion.

## Hecho

| Qué | Dónde |
| --- | --- |
| Modelo de cuatro bases y catálogo en Notion | [domain/data-model.md](domain/data-model.md) |
| Ids de bases, cuentas y categorías del hub | [domain/notion-ids.md](domain/notion-ids.md) |
| Hub Finanzas con indicadores y presupuestos de septiembre 2026 | Notion |
| Descripción de la captura que hoy escribe en Notion | [capture-iphone/](capture-iphone/shortcuts.md) |
| Proyecto NestJS en este repositorio | [README](../README.md) |
| Movimiento válido: COP, peso entero, ingreso o gasto | [decisions/ADR-0001-dinero-moneda-y-fecha.md](decisions/ADR-0001-dinero-moneda-y-fecha.md) |
| Registro en memoria: alta, lista, consulta, edición, borrado y saldo | `src/transactions/` |
| Filtro por tipo, categoría y rango de fechas | [decisions/ADR-0002-rango-de-fechas.md](decisions/ADR-0002-rango-de-fechas.md) |
| Lint y formato como comandos del README | [README](../README.md) |
| Captura directa a la API, en lugar de leer Notion | [decisions/ADR-0003-captura-directa.md](decisions/ADR-0003-captura-directa.md) |

## Siguiente

1. Guardar el movimiento en PostgreSQL. Crear, editar, borrar, filtrar y el saldo siguen igual, y el registro sobrevive al reinicio.
2. Dejar el JSON de `POST /transactions` como el contrato del formulario del atajo. Hoy el atajo pregunta monto, categoría y cuenta; el POST pide `id`, `amount`, `description`, `category`, `method`, `type` y `date`.
3. Apuntar el atajo del iPhone a ese POST. Hasta entonces sigue escribiendo en Notion.

## Después de que el atajo escriba en la base

La web pasa a ser el lugar donde se consulta en qué se está yendo el dinero. Los presupuestos se calculan desde los movimientos guardados. Recién entonces tiene sentido hablar de recordatorios o de clasificación asistida.

## Criterio

Un ingreso o un gasto enviado por el atajo queda en PostgreSQL y la API lo puede listar, aunque el hub de Notion cambie de mes.

## Fuera de alcance de este tramo

- Leer las bases de Notion para copiar el historial.
- `page_id` y constancia de un cambio hecho en Notion.
- Subcategorías.
- Transferencias como tipo propio.
- Saldo de cuenta en tiempo real.
- Texto libre clasificado solo.
- Más de unas diez categorías de gasto.
- Autenticación y publicación del POST con datos reales.
