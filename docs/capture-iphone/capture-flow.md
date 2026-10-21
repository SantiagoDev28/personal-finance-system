# Flujo de captura

Cómo se registra un movimiento hoy, antes de la aplicación web. El canal del iPhone está en [shortcuts.md](shortcuts.md) y [iphone-widgets.md](iphone-widgets.md). La aplicación que se va a construir consume el resultado ya escrito en Notion: [../context.md](../context.md).

El hábito muere si el flujo es: abrir Notion → buscar página → abrir database → nueva fila → 7 campos.

El flujo correcto:

```text
¿Cuánto?     15000
Categoría    Alimentación
Cuenta       Nequi
             ✓ Registrado
```

Concepto y necesidad son opcionales. Fecha = hoy.

## Campos mínimos vs completos

| Campo | Formulario / atajo rápido | Registro completo |
| --- | --- | --- |
| Valor | Sí | Sí |
| Tipo | Fijo (gasto o ingreso) | Sí |
| Categoría | Sí | Sí |
| Cuenta | Sí | Sí |
| Concepto | Opcional | Recomendado |
| Fecha | Hoy | Sí |
| Necesidad | Oculto | Opcional |
| Notas | Oculto | Opcional |

## Orden de adopción

1. **Formulario Notion** (vistas *Registrar gasto* / *Registrar ingreso* en Movimientos). Un tap abre el form. Sin token.
2. Cuando registres casi todos los días, pasa al **atajo API**: no ves Notion, solo tres preguntas.
3. Recién entonces, recordatorio diario a las 21:00.

## Verificar que el núcleo funciona

Hay un movimiento de ejemplo: **Almuerzo (ejemplo)** — $18.000, Alimentación, Nequi, 2 sep 2026. Debe verse en:

- Tabla *Gastos septiembre*
- Donut *En qué se me está yendo el dinero*
- Número *Gastos* del hub

Si aparece, el modelo está vivo. Bórralo cuando registres el primero de verdad.

## Qué no pedir en el momento del gasto

No preguntes subcategoría, notas ni «¿era necesario?» en la calle. Esas etiquetas se pueden completar el domingo en 5 minutos, o nunca. Un gasto registrado imperfecto vale más que uno perfecto que no se anotó.
