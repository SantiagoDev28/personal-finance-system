# Roadmap

El repositorio guarda el contexto. La aplicación todavía no existe. Se construye a mano, con NestJS, desde cero.

```text
Contexto y fuente Notion
    → proyecto NestJS vacío, en este repo
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

## Siguiente, cuando se pida

1. Crear el proyecto NestJS desde cero en este repositorio, sin generarlo de antemano en este paso.
2. Conectar la lectura a las bases de Notion ya documentadas.
3. Reescribir cada movimiento en la base propia y guardarlo de forma permanente.
4. Dejar trazable cada ingreso y cada gasto: origen en Notion, tipo, valor, fecha, categoría, cuenta y constancia si el origen cambia.

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
