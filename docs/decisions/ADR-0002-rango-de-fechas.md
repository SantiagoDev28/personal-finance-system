# ADR 0002: Rango de fechas del filtro

Estado: aceptada.

El filtro de movimientos compara el instante guardado con dos límites de calendario. Esta decisión fija qué día abre `startDate` y hasta qué momento llega `endDate`.

## Contexto

Un movimiento guarda un `Date`: el instante del hecho, no un día suelto. Quien filtra el listado o el resumen manda fechas de calendario, `YYYY-MM-DD`. El rango tiene que incluir los movimientos de ese día, también los que ocurrieron por la tarde.

`findByFilter` ya compara `transaction.date` con esos límites. El resumen filtrado y el resumen total pasan por `calculateResume`. Faltaba dejar escrito dónde empieza y dónde termina el día.

## Decisión

**startDate** es la fecha de inicio. El movimiento entra si su instante guardado es mayor o igual a esa fecha. Una fecha `YYYY-MM-DD` es el comienzo de ese día: `00:00:00.000` UTC.

**endDate** es la fecha final, contada hasta el último segundo de ese día. Para una fecha `YYYY-MM-DD`, el límite pasa a `23:59:59.999` UTC. El movimiento entra si su instante guardado es menor o igual a ese momento.

Las dos comparaciones usan el instante guardado. El filtro no cambia la fecha del movimiento.

## Alternativas

- Cortar `endDate` a medianoche del día escrito. Se descartó: un movimiento de las 15:00 de esa fecha quedaría fuera.
- Exigir un instante completo en `endDate` y no ampliar el día. Se descartó: quien filtra por fecha espera el día entero.
- Medir el último segundo en `America/Bogota`. Queda para cuando el día de calendario en Colombia sea la regla del filtro. Hoy el límite de `endDate` se calcula en UTC, igual que el instante que `new Date('YYYY-MM-DD')` produce para `startDate`.

## Consecuencias

- `startDate=2026-10-01` y `endDate=2026-10-03` incluyen desde el 1 de octubre a las 00:00:00.000 UTC hasta el 3 de octubre a las 23:59:59.999 UTC.
- La ampliación al último segundo ocurre cuando `endDate` es solo `YYYY-MM-DD`. Si el valor trae hora, el límite es ese instante y no se mueve al final del día.
- Medianoche UTC no es medianoche en Bogotá. El día de calendario en Colombia sigue la nota de [ADR 0001](ADR-0001-dinero-moneda-y-fecha.md).
