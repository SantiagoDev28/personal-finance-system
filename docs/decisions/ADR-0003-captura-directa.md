# ADR 0003: Captura directa a la API

Estado: aceptada.

El movimiento nace en el atajo del iPhone y se guarda en PostgreSQL a través de la API. Esta decisión sustituye, para los sprints siguientes, la de leer Notion y reescribir cada fila.

## Contexto

En octubre 2026 el plan era otro: los atajos escribían en Notion y la aplicación iba a leer esas bases, copiar cada movimiento y guardar el `page_id`. Ese canal sigue existiendo hoy. [capture-iphone/](../capture-iphone/shortcuts.md) lo describe. No es el plan de lo que sigue.

El servidor NestJS ya acepta un movimiento en `POST /transactions`, lo valida y lo guarda en memoria. Editar, borrar, filtrar y el saldo también viven ahí. Al reiniciar el servidor la lista se vacía. PostgreSQL todavía no está.

## Decisión

El registro entra por este camino:

```text
Atajo del iPhone
Formulario de ingreso o gasto
        ↓
HTTP POST + JSON
        ↓
API NestJS
POST /transactions
        ↓
PostgreSQL
Almacenamiento persistente
```

La API es el sistema que valida y guarda. PostgreSQL es el archivo permanente. El atajo es quien crea el movimiento. Notion no es la fuente de este tramo y la aplicación no lo lee para armar el registro.

El orden de los sprints siguientes es el de ese dibujo, de abajo hacia arriba, porque el POST ya existe y la base no:

1. Persistir en PostgreSQL lo que el API ya hace en memoria: crear, editar, borrar, filtrar y calcular el saldo. El saldo sigue saliendo de los movimientos.
2. Dejar el JSON de `POST /transactions` como el contrato que el formulario del atajo puede enviar.
3. Apuntar el atajo a ese POST. Hasta entonces, el atajo sigue escribiendo en Notion.

## Alternativas

- Seguir leyendo Notion y reescribir cada página en la base propia. Se descartó: el movimiento pasaría por dos sistemas antes de quedar guardado, y el atajo ya puede hablarle a la API.
- Guardar otra vez en Notion y usar PostgreSQL solo como copia. Se descartó: la base permanente sería un reflejo, no el registro.
- Cambiar el atajo antes de tener PostgreSQL. Se descartó: el POST actual olvida los movimientos al reiniciar.

## Consecuencias

- El criterio de este tramo deja de ser «seguir el movimiento hasta su fila de Notion». Pasa a ser: un ingreso o un gasto enviado por el atajo queda en PostgreSQL y la API lo puede listar.
- `page_id`, la constancia de un cambio en Notion y la ingesta de cuentas, categorías y presupuestos salen de los sprints próximos. Los documentos de [domain/](../domain/data-model.md) y [capture-iphone/](../capture-iphone/shortcuts.md) describen el hub y el atajo que existen hoy.
- Plan Financiero sigue fuera. Moneda COP, valor positivo y tipo ingreso o gasto se mantienen. La decisión de dinero y fecha sigue en [ADR 0001](ADR-0001-dinero-moneda-y-fecha.md).
- El atajo de hoy pregunta monto, categoría y cuenta. El POST de hoy pide `id`, `amount`, `description`, `category`, `method`, `type` y `date`. Encajar el formulario en ese JSON es el paso 2, no esta decisión.
- Hasta que exista autenticación, ese POST no se publica con datos reales. El token de Notion, mientras el atajo viejo siga vivo, permanece fuera del repositorio.
