# Widgets de iPhone

El gasto y el ingreso se capturan con un widget de **Atajos**. El toque pregunta el monto y hace `POST /transactions`. La guía está en [shortcuts.md](shortcuts.md). PostgreSQL guarda la fila.

El widget nativo de Notion **solo abre una página**. No pregunta el monto ni crea un movimiento.

```text
Pantalla de inicio
        │
        ▼
┌─────────────────────────┐
│     MIS FINANZAS        │
│  💸 Nuevo gasto         │  ← Atajos, POST /transactions
│  💰 Nuevo ingreso       │  ← Atajos, POST /transactions
│  📊 Ver finanzas        │  ← abre el hub, no registra
└───────────┬─────────────┘
            │ tap 💸
            ▼
       ¿Cuánto?     15000
       Categoría    Alimentación
       Cuenta       Efectivo
            │
            ▼
     POST /transactions
            │
            ▼
       ✓ Gasto registrado, si la respuesta trae id
```

## Qué widget usar

| Acción | Widget | Qué hace |
| --- | --- | --- |
| Nuevo gasto | **Atajos** | Pregunta monto, categoría y cuenta. Envía `expense` |
| Nuevo ingreso | **Atajos** | Igual, con `income` y el menú de ingreso |
| Ver finanzas | **Atajos** o **Notion** | Abre el hub. No crea una fila |

## Montar la central

### 1. Dos atajos de captura y uno para ver

En la app **Atajos**, sigue [shortcuts.md](shortcuts.md):

1. `💸 Nuevo gasto` — `POST /transactions` con `type` `expense`.
2. `💰 Nuevo ingreso` — el mismo POST con `type` `income`.
3. `📊 Ver finanzas` — **Abrir URL** del hub. No envía el formulario.

### 2. Widget en la pantalla de inicio

1. Mantén pulsado el fondo → **Editar** → **Añadir widget**.
2. Busca **Atajos**.
3. Tamaño **mediano**, o tres widgets **pequeños**.
4. Asigna `💸 Nuevo gasto`, `💰 Nuevo ingreso` y `📊 Ver finanzas`.

El widget **Notion** de la pantalla de inicio, si lo dejas, solo muestra el hub. No es la captura.

### 3. Centro de control

Ajustes → **Centro de control** → **Añadir un control** → **Atajo** → `💸 Nuevo gasto` y `💰 Nuevo ingreso`. Ahí solo hay botones.

## Cómo se siente

1. Tap en **💸 Nuevo gasto**.
2. `15000`.
3. **Alimentación**.
4. **Efectivo**.
5. Banner **Gasto registrado** solo si la API devolvió el movimiento.

La fecha es hoy. El concepto es la categoría. Después, `GET /transactions` muestra la fila. Notion no recibe una página por ese toque.

El atajo no se instala solo. Hay que armarlo una vez en el iPhone, con el servidor encendido y la URL de este equipo.
