# Sistema de finanzas personales

Repositorio listo para una aplicación web. Todavía no hay código.

Hoy los ingresos y los gastos viven en Notion. En el iPhone, unos atajos los capturan. La aplicación que sigue va a consumir esos datos, reescribirlos en su propia base y guardarlos de forma permanente, con trazabilidad de cada movimiento.

El servidor se construye con NestJS, desde cero y a mano, en este mismo repositorio. La decisión y el alcance están en [docs/context.md](docs/context.md).

## Hub en Notion

El hub **Finanzas** es un borrador privado. Es la fuente que la aplicación va a leer.

- [Finanzas (dashboard)](https://app.notion.com/p/3cff454b5630814690fec87bfbd8b82a)
- [Captura iPhone](https://app.notion.com/p/3cff454b563081808d12d092cc269f01)
- [Modelo de datos](https://app.notion.com/p/3cff454b5630815a91c3d34733d12a79)
- [Roadmap](https://app.notion.com/p/3cff454b5630810ebb0deb82723e8de2)
- [IDs para API](https://app.notion.com/p/3cff454b5630817e907cc625ccff93ef)

La página [Plan Financiero](https://app.notion.com/p/305f454b5630808bb33ddd0fbf6d25c4) sigue siendo la brújula de metas y reglas. Este sistema es el registro diario.

## Documentación

| Archivo | Para qué |
| --- | --- |
| [docs/context.md](docs/context.md) | Qué será la aplicación y qué se conserva |
| [docs/architecture.md](docs/architecture.md) | Web, ingesta desde Notion y base permanente |
| [docs/roadmap.md](docs/roadmap.md) | Orden para crear NestJS desde cero |
| [docs/domain/data-model.md](docs/domain/data-model.md) | Esquema de las cuatro bases |
| [docs/domain/notion-ids.md](docs/domain/notion-ids.md) | IDs que la aplicación tiene que leer |
| [docs/capture-iphone/shortcuts.md](docs/capture-iphone/shortcuts.md) | Cómo capturan hoy los atajos. Es referencia, no el plan de programación |
| [docs/development/workflow.md](development/workflow.md) | Ramas, Conventional Commits y smart commits con PER |

## Principios

- Registrar primero, decidir después.
- Pocas categorías. Subcategorías solo si cambian una decisión.
- El valor se guarda positivo. Gasto o ingreso lo define el tipo.
- La pregunta del registro: **¿en qué se me está yendo el dinero?**
- Moneda: **COP**.
