# Roadmap

El repositorio guarda el contexto. El servidor NestJS ya está en este repo: registra movimientos en memoria, los lista y calcula el saldo. Todavía no hay base de datos. En este roadmap, lo siguiente es leer Notion.

```text
Contexto y fuente Notion
    → proyecto NestJS con el núcleo en memoria
    → leer Notion
    → reescribir movimientos en la base permanente
    → trazabilidad de ingresos y gastos
    → la web como lugar donde se consulta el registro
```

## Hecho

| Qué | Dónde |
| --- | --- |
| Modelo de cuatro bases y catálogo en Notion | [domain/data-model.md](domain/data-model.md) |
| Ids de bases, cuentas y categorías | [domain/notion-ids.md](domain/notion-ids.md) |
| Hub Finanzas con indicadores y presupuestos de septiembre 2026 | Notion |
| Descripción de la captura por atajos de iPhone | [capture-iphone/](capture-iphone/shortcuts.md) |
| Decisión de la aplicación web y de la base permanente | [context.md](context.md) |
| Proyecto NestJS en este repositorio | [README](../README.md) |
| Registro en memoria: alta, lista, consulta y saldo | `src/transactions/` |

## Siguiente, cuando se pida

1. Conectar la lectura a las bases de Notion ya documentadas.
2. Reescribir cada movimiento en la base propia y guardarlo de forma permanente.
3. Dejar trazable cada ingreso y cada gasto: origen en Notion, tipo, valor, fecha, categoría, cuenta y constancia si el origen cambia.

## Después de que el registro permanente exista

La web pasa a ser el lugar donde se consulta en qué se está yendo el dinero. Los presupuestos se calculan desde los movimientos guardados. Recién entonces tiene sentido hablar de recordatorios o de clasificación asistida.

## Criterio

Un ingreso o un gasto guardado por la aplicación se puede seguir hasta la fila de Notion de la que salió, y sigue en la base propia aunque el dashboard de Notion cambie de mes.

## Fuera de alcance de este tramo

- Subcategorías.
- Transferencias como tipo propio.
- Saldo de cuenta en tiempo real.
- Texto libre clasificado solo.
- Más de unas diez categorías de gasto.
