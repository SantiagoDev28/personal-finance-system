# Sistema de finanzas personales

El servidor NestJS ya registra movimientos en memoria: alta, lista, consulta, edición, borrado, filtros y saldo. Al reiniciar, la lista queda vacía.

Hoy los atajos del iPhone todavía escriben en Notion. El camino que sigue es otro: el formulario del atajo hace `POST` a la API y PostgreSQL guarda el movimiento. Esa decisión está en [docs/decisions/ADR-0003-captura-directa.md](docs/decisions/ADR-0003-captura-directa.md). El alcance está en [docs/context.md](docs/context.md).

## Hub en Notion

El hub **Finanzas** es un borrador privado. Ahí viven hoy los movimientos. La aplicación no lo lee: el atajo, cuando se apunte a la API, escribirá en PostgreSQL.

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
| [docs/architecture.md](docs/architecture.md) | Atajo, API NestJS y PostgreSQL |
| [docs/roadmap.md](docs/roadmap.md) | Qué ya está hecho y el orden de los sprints siguientes |
| [docs/domain/data-model.md](docs/domain/data-model.md) | Esquema de las cuatro bases del hub actual |
| [docs/domain/notion-ids.md](docs/domain/notion-ids.md) | IDs de ese hub |
| [docs/capture-iphone/shortcuts.md](docs/capture-iphone/shortcuts.md) | Cómo capturan hoy los atajos. Es referencia, no el plan de programación |
| [docs/development/workflow.md](development/workflow.md) | Ramas, Conventional Commits y smart commits con PER |
| [docs/decisions/ADR-0001-dinero-moneda-y-fecha.md](decisions/ADR-0001-dinero-moneda-y-fecha.md) | Moneda COP, peso entero y fecha del movimiento |
| [docs/decisions/ADR-0002-rango-de-fechas.md](decisions/ADR-0002-rango-de-fechas.md) | `startDate` es la fecha de inicio; `endDate` llega hasta el último segundo del día |
| [docs/decisions/ADR-0003-captura-directa.md](decisions/ADR-0003-captura-directa.md) | El atajo hace POST a la API; PostgreSQL guarda el movimiento |
| [docs/decisions/ADR-0004-acceso-postgresql.md](decisions/ADR-0004-acceso-postgresql.md) | SQL explícito con `pg`. Sin ORM |

## Principios

- Registrar primero, decidir después.
- Pocas categorías. Subcategorías solo si cambian una decisión.
- El valor se guarda positivo. Gasto o ingreso lo define el tipo.
- La pregunta del registro: **¿en qué se me está yendo el dinero?**
- Moneda: **COP**.
