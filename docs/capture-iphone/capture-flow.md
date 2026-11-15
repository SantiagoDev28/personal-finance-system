# Flujo de captura

El atajo del iPhone registra el movimiento. Pregunta monto, categoría y cuenta, pone la fecha de hoy y hace `POST /transactions`. PostgreSQL guarda la fila. La guía del teléfono está en [shortcuts.md](shortcuts.md). La decisión está en [../decisions/ADR-0005-atajo-a-la-api.md](../decisions/ADR-0005-atajo-a-la-api.md).

```text
¿Cuánto?     15000
Categoría    Alimentación
Cuenta       Efectivo
             ↓
POST /transactions
{ amount, category, account, date, type }
             ↓
PostgreSQL
             ↓
✓ Registrado, solo si la respuesta trae id
```

Nuevo gasto envía `expense` y una categoría del menú de gasto. Nuevo ingreso envía `income` y Salario, Freelance u Otros ingresos. El tipo no se pregunta: lo fija el atajo. La fecha viaja como `yyyy-MM-dd`. El cuerpo no lleva `database_id`, `page_id` ni token de Notion.

Un monto cero, negativo o con decimales recibe `400`. El atajo no dice que quedó registrado y no aparece una fila.

`📊 Ver finanzas` y el widget de Notion abren el hub. No son este envío. El detalle del widget está en [iphone-widgets.md](iphone-widgets.md).

## Qué se envía

| Campo | De dónde sale |
| --- | --- |
| `amount` | ¿Cuánto? Entero mayor que 0 |
| `category` | El texto del menú |
| `account` | El texto del menú: Efectivo, Nequi, Bancolombia, Daviplata o Tarjeta crédito |
| `date` | Hoy, `yyyy-MM-dd` |
| `type` | `expense` en Nuevo gasto, `income` en Nuevo ingreso |

El concepto no se pregunta. La API guarda la categoría elegida como concepto.

## Qué no pedir en la calle

No preguntes subcategoría, notas ni «¿era necesario?». Un gasto registrado con la categoría del menú vale más que uno perfecto que no se anotó.
