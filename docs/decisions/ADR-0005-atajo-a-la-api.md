# ADR 0005: El atajo escribe en la API

Estado: aceptada. Sustituye el orden de los pasos 2 y 3 de [ADR 0003](ADR-0003-captura-directa.md).

El atajo del iPhone registra el movimiento en la aplicación. No escribe en Notion para que otra pieza lo lea y lo copie.

## Contexto

En octubre 2026 el plan era este: el atajo escribía en el hub Finanzas de Notion, y la aplicación leía Movimientos, Cuentas, Categorías y Presupuestos, reescribía cada página y guardaba el `page_id`. El movimiento pasaba por dos sistemas antes de existir en la app.

[ADR 0003](ADR-0003-captura-directa.md) ya descartó esa lectura. Dejó el camino atajo → `POST /transactions` → PostgreSQL, y partió el trabajo en tres pasos. El primero, persistir, ya está. Los otros dos seguían separados: primero encajar el JSON, y solo después apuntar el atajo. Mientras tanto el atajo seguía escribiendo en Notion.

Esa espera mantiene el canal que ya no queremos. PostgreSQL ya guarda alta, edición, borrado, filtro y saldo. La tabla está en `src/database/migrations`. Falta el único escritor que usa la persona: el atajo del iPhone.

Hoy ese atajo pregunta monto, categoría y cuenta, y hace `POST` a la API de Notion. La guía está en [capture-iphone/shortcuts.md](../capture-iphone/shortcuts.md). El `POST /transactions` de la app pide `id`, `amount`, `description`, `category`, `method`, `type` y `date`.

## Decisión

Un movimiento nuevo nace en el atajo y queda en PostgreSQL. El camino es uno:

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
```

**Siguiente sprint.** Apuntar los atajos de ingreso y de gasto a `POST /transactions`. El cuerpo es el formulario que el atajo puede preguntar. En ese mismo sprint el POST acepta ese formulario. No hay un sprint intermedio que deje el atajo en Notion.

**Notion.** El hub que ya existe no se borra y no se lee. No se copian sus filas, no se guarda `page_id` y no se sincroniza una cuenta, una categoría ni un presupuesto desde allí. [domain/](../domain/data-model.md) y [capture-iphone/](../capture-iphone/shortcuts.md) describen ese hub y el atajo que hoy todavía escribe en Notion. No son el plan de implementación.

**Qué no cambia.** Moneda COP, monto entero mayor que 0 y tipo `income` o `expense`, como en [ADR 0001](ADR-0001-dinero-moneda-y-fecha.md). El saldo se calcula con las filas. Plan Financiero sigue fuera. La app no se publica con datos reales hasta que haya autenticación.

## Alternativas

- Leer Notion y duplicar cada página en PostgreSQL. Se descartó: es el plan de octubre. El movimiento se escribe dos veces y la app depende de un hub que no es el registro.
- Dejar el atajo en Notion hasta terminar un contrato de JSON aparte. Se descartó: alarga el canal viejo. El JSON y el atajo son el mismo sprint, porque el cuerpo es el formulario.
- Copiar el historial de Notion antes de cambiar el atajo. Se descartó: este sprint registra lo que se capture a partir de ahora.

## Consecuencias

- El criterio del sprint es uno: un ingreso o un gasto enviado desde el iPhone queda en PostgreSQL y la API lo puede listar.
- Quien implemente el sprint modifica el atajo para que llame a la API, y ajusta `POST /transactions` a lo que ese formulario envía.
- Los documentos de captura en Notion quedan como referencia del atajo que existe hoy, hasta que este sprint los reemplace.
- El token de Notion no entra al servidor. Si el atajo viejo sigue instalado un tiempo, su token permanece fuera del repositorio.
