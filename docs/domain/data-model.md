# Modelo de datos

Forma actual de las bases en Notion. La aplicación web las consume y reescribe los movimientos en su base permanente. La decisión está en [../context.md](../context.md).

Cuatro bases bajo el hub [Finanzas](https://app.notion.com/p/3cff454b5630814690fec87bfbd8b82a).

```text
Cuentas ──┐
          ├──► Movimientos
Categorías┤         │
          └──► Presupuestos
```

## Movimientos

Hecho atómico: dinero que entra o sale.

| Campo | Tipo | Obligatorio en captura rápida | Ejemplo |
| --- | --- | --- | --- |
| Concepto | Title | No (si vacío, usar el nombre de la categoría) | Almuerzo |
| Valor | Number COP | Sí | 18000 |
| Tipo | Select: Gasto / Ingreso | Sí (fijo en el atajo) | Gasto |
| Categoría | Relation → Categorías | Sí | Alimentación |
| Fecha | Date | No (hoy) | 2026-09-02 |
| Cuenta | Relation → Cuentas | Sí | Nequi |
| Necesidad | Select: Necesario / Deseo / N/A | No | Necesario |
| Notas | Rich text | No | — |
| Impacto | Formula | — | −18000 si gasto |
| Mes | Formula | — | 2026-09 |

Fórmulas:

- `Impacto`: si Tipo es Gasto, `0 - Valor`; si no, `Valor`.
- `Mes`: `YYYY-MM` a partir de Fecha.

Vistas útiles: **Registrar gasto** (form), **Registrar ingreso** (form), **Calendario**, **Gastos septiembre**, **Ingresos septiembre**, **Gastos por categoría** (donut), **Total gastos**, **Total ingresos**.

## Cuentas

Dónde está el dinero, no solo cuánto se gastó.

| Campo | Tipo | Notas |
| --- | --- | --- |
| Nombre | Title | Nequi, Bancolombia… |
| Tipo | Select | Efectivo, Billetera, Banco, Tarjeta crédito, Ahorro |
| Activa | Checkbox | Ocultar cuentas viejas sin borrar historia |
| Saldo inicial | Number COP | Opcional; no es un ledger de doble entrada |
| Notas | Rich text | |
| Movimientos | Relation (dual) | Creada desde Movimientos |

Semilla: Efectivo, Nequi, Bancolombia, Daviplata, Tarjeta crédito.

## Categorías

Catálogo corto. No añadir una categoría nueva hasta que «Otros» se use de forma repetida y clara.

| Campo | Tipo | Notas |
| --- | --- | --- |
| Nombre | Title | Sin emoji duplicado: el icono de la página ya lo lleva |
| Tipo | Select | Gasto / Ingreso / Ambos |
| Activa | Checkbox | |
| Orden | Number | Catálogo ordenado |
| Notas | Rich text | |
| Movimientos | Relation (dual) | |
| Presupuestos | Relation (dual) | |
| Total movimientos | Rollup sum(Valor) | Acumulado histórico, no del mes |

### Gastos (orden 1–10)

Alimentación, Transporte, Hogar, Tecnología, Educación, Deporte, Ropa, Entretenimiento, Suscripciones, Otros.

### Ingresos (orden 20–22)

Salario, Freelance, Otros ingresos.

Subcategorías (Almuerzo, Comida rápida…) quedan fuera de v1.

## Presupuestos

Una fila = una categoría + un mes.

| Campo | Tipo | Notas |
| --- | --- | --- |
| Nombre | Title | `Alimentación — Sep 2026` |
| Categoría | Relation → Categorías | |
| Mes | Date | Primer día del mes |
| Monto | Number COP | Tope |
| Gastado | Number COP | Se actualiza en la revisión semanal |
| Restante | Formula | `Monto - Gastado` |
| % usado | Formula | `Gastado / Monto` (0 si Monto vacío) |

Semilla septiembre 2026:

| Categoría | Monto COP |
| --- | --- |
| Alimentación | 300.000 |
| Transporte | 150.000 |
| Deporte | 150.000 |
| Entretenimiento | 100.000 |
| Tecnología | 100.000 |
| Hogar | 200.000 |

Ajusta los montos a tu realidad; son un punto de partida alineado al roadmap, no un mandato.

## Qué no modelar aún

- Transferencias entre cuentas como tipo propio (se puede registrar dos movimientos o esperar v2).
- Subcategorías.
- Ledger de saldos en tiempo real.
- Clasificación por IA a partir de texto libre.
