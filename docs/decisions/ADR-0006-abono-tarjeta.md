# ADR 0006: La compra con tarjeta no mueve el saldo de caja

Estado: aceptada.

La compra con tarjeta es un gasto de su categoría y de su mes. El saldo de caja se mueve cuando la plata sale de una cuenta de caja, en el abono.

## Contexto

El saldo sale de las filas: ingresos menos gastos. `Tarjeta crédito` ya es una cuenta válida. Si esa compra entra en la misma resta, el saldo baja en el mes de la compra aunque la plata siga en Nu, Nequi, Daviplata o efectivo.

El pago de la tarjeta responde otra pregunta: de qué cuenta salió la plata, y en qué mes. Si ese pago se guarda como otro gasto, la categoría y el saldo lo cuentan dos veces.

## Decisión

**Compra.** Sigue siendo un movimiento `expense`. La categoría y la fecha son las de la compra. La cuenta es `Tarjeta crédito`. Entra en el gasto por categoría. No entra en el saldo de caja. Suma el pendiente de la tarjeta.

**Gasto en cuenta de caja.** Efectivo, Nequi, Nu y Daviplata siguen igual: un gasto entra en la categoría y en el saldo el mismo día.

**Abono.** Es otra fila, en `card_payments`. Lleva monto entero mayor que 0, la cuenta de origen y la fecha del pago. No tiene categoría y no es un movimiento. Baja el saldo de caja y baja el pendiente. No vuelve a aparecer en la categoría de la compra.

**Pendiente.** Gastos en `Tarjeta crédito` menos abonos, con la historia hasta el fin del rango. No es la suma del mes que se está mirando.

**Saldo de caja.** Ingresos menos gastos de cuentas de caja menos abonos.

Un abono no puede dejar el pendiente por debajo de cero. Un interés o una cuota de manejo se registra antes como gasto en `Tarjeta crédito`.

## Alternativas

- Guardar el abono como `expense`. Se descartó: diciembre restaría otra vez lo que noviembre ya mostró en la categoría, o la categoría perdería la compra.
- Restar la compra del saldo en noviembre y no registrar el abono. Se descartó: el saldo dejaría de decir cuándo salió la plata de Nu.

## Consecuencias

- `GET /transactions/resume` separa el gasto de caja, el gasto de tarjeta, los abonos, el saldo de caja y el pendiente.
- La lista por categoría sigue leyendo `transactions`. El abono no está en esa tabla.
- La salida de una cuenta junta los movimientos de esa cuenta con los abonos que salen de ella.
