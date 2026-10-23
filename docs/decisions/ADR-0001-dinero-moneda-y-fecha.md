# ADR 0001: Dinero, moneda y fecha

Estado: aceptada.

El movimiento de dominio guarda un monto, una moneda implícita y una fecha. Esta decisión fija las tres antes de haber base de datos.

## Contexto

El registro es de ingresos y gastos personales en Colombia. En Notion el valor va en COP, siempre positivo, y el tipo dice si es gasto o ingreso. La fecha del movimiento es el día en que ocurrió, no el momento en que la aplicación lo construye.

`Transaction.create` ya aplica parte de eso: el monto tiene que ser un entero mayor que 0, y la fecha inválida se rechaza. Faltaba dejar escrito qué significan ese número y esa fecha.

## Decisión

**Moneda.** Una sola: COP. El movimiento no lleva un campo de moneda. Toda cantidad del dominio es en pesos colombianos.

**Dinero.** La unidad es el peso entero. `amount` es un `number` de JavaScript que solo es válido si `Number.isInteger(amount)` y `amount > 0`.

Se rechaza:

- cero y cualquier negativo, con el mensaje `Amount must be greater than 0`;
- un número con parte decimal, y también `NaN`, con el mensaje `Amount must be an integer`.

No hay centavos. 18000 es dieciocho mil pesos, no una cantidad con decimales.

**Fecha.** `date` es el instante que entrega quien llama a `create`. Se guarda ese mismo valor. `create` no lo sustituye por la hora actual.

Una fecha inválida (`new Date('invalid-date')`, cuyo `getTime()` es `NaN`) se rechaza con `Date must be a valid date`.

El día de calendario se lee en `America/Bogota` (Colombia, UTC−5, sin horario de verano). El dominio todavía no convierte el instante a ese día: conserva el `Date` recibido. El valor de prueba `2026-09-02T00:00:00.000Z` es el 1 de septiembre de 2026 a las 19:00 en Bogotá.

## Alternativas

- Dejar el monto como decimal libre (`18000.5`). Se descartó: este registro no usa fracciones de peso, y un flotante sin regla se presta a centavos fantasma.
- Guardar centavos enteros (`18000` pesos como `1800000`). Se descartó: COP aquí no tiene subdivisión, y el número dejaría de coincidir con el valor que se escribe en Notion.
- Usar una librería decimal. Queda para más adelante. El entero de pesos cubre un movimiento personal. El entero seguro de JavaScript llega hasta `2^53 - 1`, muy por encima de cualquier monto de este registro.
- Guardar la fecha como texto `YYYY-MM-DD`. Queda para cuando el día de calendario en Bogotá sea la regla. Hoy el dominio guarda el instante recibido.

## Consecuencias

- Quien cree un movimiento pasa el monto en pesos enteros y la fecha del hecho.
- Un total se puede sumar con enteros. No hace falta redondear centavos.
- Mostrar «2 de septiembre» en Colombia exige interpretar el instante en `America/Bogota`. Medianoche UTC no es ese día.
- Si más adelante la fecha de negocio es solo un día, como el campo Fecha de Notion, esta decisión se revisa y el valor pasa a ser un día de calendario, no un instante.
