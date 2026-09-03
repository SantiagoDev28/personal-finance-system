# Widgets de iPhone (sin formulario Notion)

El widget nativo de Notion **solo abre una página**. No pregunta el monto ni crea un movimiento.

La captura vive en un **widget de Atajos**. Notion ni se abre.

```text
Pantalla de inicio
        │
        ▼
┌─────────────────────────┐
│     MIS FINANZAS        │
│  💸 Registrar gasto     │  ← widget Atajos (captura)
│  💰 Registrar ingreso   │  ← widget Atajos (captura)
│  📊 Ver resumen         │  ← widget Atajos o Notion
└───────────┬─────────────┘
            │ tap 💸
            ▼
       ¿Cuánto?     15000
       Categoría    Alimentación
       Cuenta       Nequi
            │
            ▼
     POST → Mayores gastos
            │
            ▼
       ✓ Gasto registrado
```

## Qué widget usar para cada acción

| Acción | Widget | Por qué |
| --- | --- | --- |
| Registrar gasto | **Atajos** | Pregunta en el sistema iOS y escribe en Notion |
| Registrar ingreso | **Atajos** | Igual, con `Tipo = Ingreso` |
| Ver resumen | **Notion** o Atajos «Abrir URL» | Solo hay que abrir el hub Finanzas |

No uses Share form ni la página «Probar atajo iPhone» para el hábito diario. Eso era un puente. El destino es el atajo con API.

## Montar la central (una vez)

### 1. Tres atajos

En la app **Atajos**, crea:

Guía toque a toque (qué buscar en Atajos, qué pegar, cómo armar el widget): [shortcuts.md](shortcuts.md).

1. `💸 Nuevo gasto` — pregunta valor, categoría, cuenta; `POST` a Notion.
2. `💰 Nuevo ingreso` — duplicado del primero, `Tipo = Ingreso`.
3. `📊 Ver finanzas` — **Abrir URL** → `https://www.notion.so/3cff454b5630814690fec87bfbd8b82a`

### 2. Widget en la pantalla de inicio

1. Mantén pulsado el fondo → **Editar** → **Añadir widget**.
2. Busca **Atajos**.
3. Elige tamaño **mediano** (lista de varios atajos) o tres widgets **pequeños**.
4. Asigna `💸 Nuevo gasto`, `💰 Nuevo ingreso` y `📊 Ver finanzas`.

Opcional, abajo: widget **Notion** pequeño apuntando a **Finanzas** (márcala como favorita). Es un atajo visual al dashboard, no a la captura.

### 3. Centro de control (el que ya usas para gasto)

Ajustes → **Centro de control** → **Añadir un control** → **Atajo** → asigna `💰 Nuevo ingreso` y `📊 Ver finanzas`. Ahí solo hay botones, no una miniatura del dashboard.

### 4. Vista previa con números

Pantalla de inicio → widget **Notion** mediano → página **Finanzas** (`3cff454b5630814690fec87bfbd8b82a`). Eso sí muestra un recorte del hub.

## Cómo se siente al usarlo

En la calle, después de pagar el almuerzo:

1. Tap en **💸 Registrar gasto** (ni Notion ni Safari).
2. Teclado numérico: `15000`.
3. Lista: **Alimentación**.
4. Lista: **Nequi**.
5. Banner: **Gasto registrado**.

El concepto puede omitirse (el atajo usa el nombre de la categoría). Fecha = hoy. Necesidad y notas se dejan para el domingo, o nunca.

Luego, en el hub Finanzas, el gasto ya está en Mayores gastos, el donut y el total del mes.

## Qué hay que tener en Notion (ya está)

- Base **Mayores gastos** (Movimientos) con Categoría y Cuenta como relaciones.
- Integración interna conectada a esa base, a Categorías y a Cuentas.
- Token del atajo (llavero del iPhone, no el repo).

IDs y JSON del `POST`: [shortcuts.md](shortcuts.md) y [notion-ids.md](notion-ids.md).

## Lo que no hace el MCP

No puede instalar el widget ni crear el atajo en tu iPhone. Las bases y los IDs ya están; el anidado al teléfono es el paso que haces una vez en Atajos.
