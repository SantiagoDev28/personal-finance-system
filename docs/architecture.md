# Arquitectura

## Objetivo

Reducir el registro de un movimiento a tres gestos en el iPhone. Notion guarda la verdad; el teléfono solo captura y muestra resumen.

```text
iPhone → Widget Atajos → 3 preguntas → API Notion → Dashboard
```

El formulario de Notion no entra en el flujo diario. El widget nativo de Notion solo sirve para **ver resumen**.

## Capas

```text
┌─────────────────────────────────────────┐
│  Captura (iPhone)                       │
│  Widget Atajos (captura) + API          │
│  Widget Notion (solo ver resumen)       │
└──────────────────┬──────────────────────┘
                   ▼
┌─────────────────────────────────────────┐
│  Núcleo (Notion)                        │
│  Cuentas ──► Movimientos ◄── Categorías │
│                    │                    │
│                    ▼                    │
│              Presupuestos               │
└──────────────────┬──────────────────────┘
                   ▼
┌─────────────────────────────────────────┐
│  Lectura                                │
│  Hub Finanzas: 5 indicadores            │
│  Plan Financiero: metas y reglas        │
└─────────────────────────────────────────┘
```

| Capa | Responsabilidad | Qué no hace |
| --- | --- | --- |
| Captura | Preguntar lo mínimo y escribir un movimiento | Calcular presupuestos, clasificar con IA |
| Núcleo | Ser la fuente de verdad | Sustituir el widget |
| Lectura | Responder «¿cuánto y en qué?» | Servir de formulario |

**Plan Financiero** (página ya existente) es la brújula: metas, reglas, seguimiento anual. **Finanzas** es el sistema operativo: cada gasto e ingreso.

## Acciones del iPhone

| Acción | Destino | Latencia aceptable |
| --- | --- | --- |
| Registrar gasto | Widget Atajos → `POST /v1/pages` | < 15 s |
| Registrar ingreso | Igual, `Tipo = Ingreso` | < 20 s |
| Ver resumen | Abrir hub Finanzas | 1 tap |

## Dos caminos de captura

1. **Formulario Notion** — cero código, un tap abre el form. Suficiente para demostrar el hábito.
2. **Atajo + API** — pregunta valor, categoría y cuenta; no muestra la UI de Notion. Usar cuando el formulario ya se sienta lento.

Detalle: [capture-flow.md](capture-flow.md), [iphone-widgets.md](iphone-widgets.md), [shortcuts.md](shortcuts.md).

## Decisiones de diseño

- **Valor siempre positivo.** El signo lo calcula la fórmula `Impacto` según `Tipo`. Así el atajo nunca envía negativos por error.
- **Cuenta es relación, no select duplicado.** «Método» (Nequi, efectivo…) es la cuenta. Un solo campo.
- **Categorías cortas.** Diez de gasto, tres de ingreso. Subcategoría queda fuera del v1.
- **Presupuesto.Gastado es número, no rollup mensual.** Un rollup de Notion no puede filtrar «este mes». Se actualiza en la revisión semanal (o con automatización después).
- **Filtros de dashboard en septiembre 2026.** En la UI de Notion, cámbialos a *Este mes* para que rueden solos.

## Límites de Notion (no pelear contra ellos)

- Los rollups no filtran por mes.
- Los widgets nativos de Notion abren páginas; no ejecutan atajos.
- Una integración interna solo ve páginas con las que está conectada.
- Las fórmulas del dashboard (disponible, tasa de ahorro) no viven en una sola celda: se leen de las vistas filtradas Ingresos y Gastos.

## Seguridad

- El token de la integración no entra al repo (`.env` está en `.gitignore`).
- El hub se creó como borrador privado.
- No hace falta compartir las bases en público: el formulario se puede compartir solo contigo; la API usa el token en el atajo (en el llavero del iPhone).
