# Sistema de finanzas personales

Arquitectura: **iPhone → Widget Atajos → 3 preguntas → Notion → Dashboard**.

Tres acciones desde el teléfono, sin abrir Notion cada vez:

- Registrar gasto
- Registrar ingreso
- Ver resumen

Este repo documenta el modelo, las bases de Notion y cómo anidarlas al iPhone. El sistema operativo vive en Notion; el hábito vive en el widget.

## Hub en Notion

El hub **Finanzas** es un borrador privado. Se puede mover a otra ubicación del workspace cuando indiques dónde debe vivir.

- [Finanzas (dashboard)](https://app.notion.com/p/3cff454b5630814690fec87bfbd8b82a)
- [Captura iPhone](https://app.notion.com/p/3cff454b563081808d12d092cc269f01)
- [Modelo de datos](https://app.notion.com/p/3cff454b5630815a91c3d34733d12a79)
- [Roadmap](https://app.notion.com/p/3cff454b5630810ebb0deb82723e8de2)
- [IDs para API](https://app.notion.com/p/3cff454b5630817e907cc625ccff93ef)

La página existente [Plan Financiero](https://app.notion.com/p/305f454b5630808bb33ddd0fbf6d25c4) no se modificó: sigue siendo la brújula (metas, reglas, seguimiento 2026). Este sistema es el registro diario.

## Qué hay creado

| Pieza | Estado |
| --- | --- |
| Modelo de datos | Listo |
| Base Cuentas (5 cuentas) | Lista |
| Base Categorías (10 gastos + 3 ingresos) | Lista |
| Base Movimientos + formularios | Lista |
| Base Presupuestos (septiembre 2026) | Lista |
| Dashboard con 5 indicadores | Listo |
| Guía de widgets y atajos iPhone | Lista |
| Atajo instalado en el iPhone | Pendiente (tú) |
| Widget en pantalla de inicio | Pendiente (tú) |
| Recordatorios / IA | Más adelante |

## Documentación

| Archivo | Para qué |
| --- | --- |
| [docs/architecture.md](docs/architecture.md) | Flujo, capas y límites de Notion |
| [docs/data-model.md](docs/data-model.md) | Esquema de las cuatro bases |
| [docs/notion-ids.md](docs/notion-ids.md) | IDs para API, atajos y relaciones |
| [docs/capture-flow.md](docs/capture-flow.md) | Cómo registrar sin fricción |
| [docs/iphone-widgets.md](docs/iphone-widgets.md) | Widget Notion + widget Atajos |
| [docs/shortcuts.md](docs/shortcuts.md) | Guía toque a toque: crear los atajos en el iPhone |
| [docs/roadmap.md](docs/roadmap.md) | Orden de implementación |

## Cómo empezar hoy

1. En el iPhone sigue [docs/shortcuts.md](docs/shortcuts.md) (o la página [Captura iPhone](https://app.notion.com/p/3cff454b563081808d12d092cc269f01)): integración → atajo `💸 Nuevo gasto` → widget.
2. Prueba con $15.000 / Alimentación / Nequi y confirma la fila en Mayores gastos.
3. Duplica el atajo para ingreso y añade **Ver finanzas**.

## Principios

- Registrar primero, decidir después.
- Pocas categorías. Subcategorías solo si cambian una decisión.
- El dashboard responde una pregunta: **¿en qué se me está yendo el dinero?**
- No automatizar ni meter IA antes de tener 7 días de datos reales.

## Moneda

Los importes están en **COP** (`colombian_peso` en Notion).
