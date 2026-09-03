# Guía: crear los atajos en el iPhone

Haz esto **en el iPhone**, app **Atajos**. No uses el formulario de Notion.

Vas a crear tres atajos:

1. `💸 Nuevo gasto` — el importante (esta guía)
2. `💰 Nuevo ingreso` — duplicado del primero
3. `📊 Ver finanzas` — una sola acción

Al final los añades al **Centro de control** (igual que el de gasto) y, si quieres números a la vista, un widget Notion en la pantalla de inicio.

---

## Antes: conectar Notion (5 minutos, una sola vez)

Sin esto el atajo responde 404.

### 1. Crear la integración

1. En Safari del iPhone o en el Mac abre [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations).
2. **Nueva integración**.
3. Nombre: `Finanzas iPhone`.
4. Tipo: **Interna**.
5. Asociarla a tu workspace.
6. **Guardar** y **copiar el token** (`secret_…` o `ntn_…`).
7. Pégalo en Notas (o en el llavero). No lo subas a GitHub ni lo pegues en un chat.

### 2. Darle permiso a las bases

En Notion, en cada una de estas tres páginas toca **···** (arriba a la derecha) → **Conexiones** / **Connections** → **Conectar a** → `Finanzas iPhone`:

- [Mayores gastos](https://app.notion.com/p/c1642803748248acba245c31686ff821) (es la base de movimientos)
- [Categorías](https://app.notion.com/p/093b4198a6a341a29dbcfe06c6c90762)
- [Cuentas](https://app.notion.com/p/a99099771ecb4c6b897da26f0e25dfe4)

Si no las conectas, el atajo no puede escribir ni enlazar categoría/cuenta.

---

## Atajo 1 — `💸 Nuevo gasto`

### Abrir un atajo vacío

1. Abre la app **Atajos**.
2. Toca **+** (arriba a la derecha).
3. Toca el nombre **Atajo nuevo** (arriba) y cámbialo a `💸 Nuevo gasto`.
4. Abajo verás **Buscar apps y acciones**. Ahí vas a buscar cada pieza.

A partir de aquí, cada bloque es una **acción** que se apila de arriba a abajo.

---

### Acción 1 — Preguntar el valor

1. Busca **Pedir entrada** y tócala.
2. Toca **Pregunta** y escribe: `¿Cuánto?`
3. Toca **Tipo de entrada** (o el valor por defecto “Texto”) y elige **Número**.
4. Apaga decimales si no los usas.
5. Busca **Definir variable**.
6. Nombre de la variable: `Valor`.
7. En **Valor** (el campo de la acción), toca y elige la burbuja mágica **Entrada proporcionada** (el número que acabas de pedir).

Listo: ya tienes el monto guardado.

---

### Acción 2 — Elegir categoría

1. Busca **Elegir del menú** y tócala.
2. En **Indicación** escribe: `Categoría`.
3. Toca **Uno** y renómbralo a `Alimentación`.
4. Toca **Dos** y renómbralo a `Transporte`.
5. Toca **Añadir nuevo elemento** hasta tener estas 10 opciones, **con exactamente este texto**:

   - Alimentación
   - Transporte
   - Hogar
   - Tecnología
   - Educación
   - Deporte
   - Ropa
   - Entretenimiento
   - Suscripciones
   - Otros

6. Dentro de **cada** opción del menú (el hueco que se abre debajo del nombre) añade **Definir variable**:
   - Nombre: `CategoriaID` (el mismo nombre en todas).
   - Valor: pega el ID de esa categoría (tabla de abajo).

| Opción del menú | Pega esto en `CategoriaID` |
| --- | --- |
| Alimentación | `3cff454b563081e39ab4d5c5aaa68b06` |
| Transporte | `3cff454b563081d8aab8f66e0426d6f5` |
| Hogar | `3cff454b563081108616dacffa81cd01` |
| Tecnología | `3cff454b56308153bd41dc4cc1736658` |
| Educación | `3cff454b563081f1a7ddc6b888961ba3` |
| Deporte | `3cff454b563081db96acdd7a65cc7cac` |
| Ropa | `3cff454b56308182895de5e19800f8d2` |
| Entretenimiento | `3cff454b56308182b073ee4d1cabb471` |
| Suscripciones | `3cff454b563081a7bc95f616b0bb1300` |
| Otros | `3cff454b5630812db018d96af021dc0a` |

7. **Fuera** del menú (después de que termine el bloque, no dentro de una opción), añade otra **Definir variable**:
   - Nombre: `Concepto`
   - Valor: toca y elige la burbuja **Elegir del menú** (el nombre que tocaste: “Alimentación”, etc.).

Así el concepto se rellena solo con la categoría. No preguntas nada extra en la calle.

---

### Acción 3 — Elegir cuenta

Igual que la categoría.

1. **Elegir del menú**.
2. Indicación: `Cuenta`.
3. Opciones: `Efectivo`, `Nequi`, `Bancolombia`, `Daviplata`, `Tarjeta crédito`.
4. En cada una, **Definir variable** `CuentaID` con este valor:

| Opción del menú | Pega esto en `CuentaID` |
| --- | --- |
| Efectivo | `3cff454b563081889c8bdf74ffc31235` |
| Transferencia | `3cff454b5630812caee9f2aa97341659` |
| Tarjeta crédito | `3cff454b563081388987d52aff5b75ad` |

---

### Acción 4 — Fecha de hoy

1. Busca **Fecha**. Deja **Fecha actual**.
2. Busca **Formatear fecha**.
3. **Fecha**: la burbuja de la acción Fecha.
4. **Formato**: **Personalizado**.
5. En el campo de formato escribe exactamente: `yyyy-MM-dd`
6. **Definir variable** `FechaHoy` = el resultado de Formatear fecha.

---

### Acción 5 — El JSON (el mensaje que se envía a Notion)

1. Busca **Texto**.
2. Pega esto **tal cual**. Luego sustituyes las 5 palabras en MAYÚSCULAS por burbujas (paso 3):

```json
{
  "parent": {
    "database_id": "c1642803748248acba245c31686ff821"
  },
  "properties": {
    "Concepto": {
      "title": [{ "text": { "content": "CONCEPTO" } }]
    },
    "Valor": { "number": VALOR },
    "Tipo": { "select": { "name": "Gasto" } },
    "Fecha": { "date": { "start": "FECHAHOY" } },
    "Categoría": {
      "relation": [{ "id": "CATEGORIAID" }]
    },
    "Cuenta": {
      "relation": [{ "id": "CUENTAID" }]
    }
  }
}
```

3. En ese texto, borra cada palabra en mayúsculas y toca **Variable** (o el botón de variables arriba del teclado) para insertar:

| En el texto borra | Inserta la variable |
| --- | --- |
| `CONCEPTO` | `Concepto` |
| `VALOR` | `Valor` |
| `FECHAHOY` | `FechaHoy` |
| `CATEGORIAID` | `CategoriaID` |
| `CUENTAID` | `CuentaID` |

**Importante:** `VALOR` va **sin comillas**. Los IDs y el concepto sí van entre comillas, como en el ejemplo.

Queda algo así (las burbujas se ven ovaladas en Atajos, no como texto plano):

`"number": Valor`  ← correcto  
`"number": "Valor"`  ← incorrecto, Notion lo rechaza

---

### Acción 6 — Enviar a Notion

1. Busca **Obtener el contenido de la URL** (a veces aparece como **Obtener contenido de URL**).
2. En **URL** pega: `https://api.notion.com/v1/pages`
3. Toca **Mostrar más** si está plegado.
4. **Método**: `POST`.
5. **Encabezados**: toca **Añadir encabezado** tres veces:

| Encabezado | Valor |
| --- | --- |
| `Authorization` | `Bearer ` y pegado **justo después** (con un espacio) tu token |
| `Notion-Version` | `2022-06-28` |
| `Content-Type` | `application/json` |

Ejemplo del primero: `Bearer secret_abc123…` (todo en un solo campo).

6. **Cuerpo de la solicitud**:
   - Si ves opciones: elige **Archivo**.
   - Como archivo, elige la burbuja de la acción **Texto** (el JSON).
   - Si tu iOS pide **JSON** en vez de Archivo: elige JSON y, si te deja pegar texto crudo, usa el mismo Texto. Si solo te deja un diccionario anidado, vuelve a **Archivo**.

---

### Acción 7 — Confirmar

1. Busca **Mostrar notificación**.
2. Título: `Finanzas`.
3. Cuerpo: `Gasto registrado`.

---

### Cómo queda el atajo (de arriba a abajo)

```text
Pedir entrada (número) ¿Cuánto?
Definir variable Valor
Elegir del menú Categoría  →  CategoriaID + Concepto
Elegir del menú Cuenta     →  CuentaID
Fecha actual
Formatear fecha yyyy-MM-dd
Definir variable FechaHoy
Texto (JSON)
Obtener contenido de URL  POST
Mostrar notificación
```

Toca **Hecho** (arriba a la derecha).

---

### Probarlo ahora

1. En la lista de Atajos, toca **💸 Nuevo gasto** (el play / el recuadro, no el lápiz).
2. La primera vez iOS pregunta si puede conectarse a `api.notion.com` → **Permitir**.
3. Escribe `15000` → **Alimentación** → **Nequi**.
4. Debe salir **Gasto registrado**.
5. Abre [Mayores gastos](https://app.notion.com/p/c1642803748248acba245c31686ff821): tiene que aparecer un movimiento de $15.000 en Alimentación / Nequi, fecha de hoy.

Si falla, no sigas al widget. Mira la tabla del final.

---

## Atajo 2 — `💰 Nuevo ingreso`

Misma receta que el gasto. La forma más segura: **duplicar** `💸 Nuevo gasto` y cambiar solo lo de las tablas de abajo. El token, la URL de la API y el `database_id` no se tocan.

IDs fijos (igual que en gasto):

| Qué | ID / valor |
| --- | --- |
| Base Mayores gastos (`database_id`) | `c1642803748248acba245c31686ff821` |
| API | `https://api.notion.com/v1/pages` |
| `Tipo` en el JSON | `Ingreso` (no `Gasto`) |

### Paso a paso (duplicando)

1. App **Atajos**.
2. Mantén pulsado **💸 Nuevo gasto** → **Duplicar**.
3. Entra al duplicado (lápiz). Arriba, cambia el nombre a `💰 Nuevo ingreso`.

### Qué cambiar en el menú Categoría

Borra las 10 opciones de gasto. Deja **solo estas 3**. En cada una, variable `CategoriaID` (el mismo nombre de variable que ya usas):

| Opción del menú (texto exacto) | Pega esto en `CategoriaID` |
| --- | --- |
| Salario | `3cff454b56308183a6e9e982c5150da4` |
| Freelance | `3cff454b5630813ab6a9ce49e37643b9` |
| Otros ingresos | `3cff454b5630811f83d7c765a4e495e3` |

La variable `Concepto` (fuera del menú) se queda igual: burbuja **Elegir del menú**. Si eliges Salario, el movimiento se llamará “Salario”.

### Menú Cuenta (mismos IDs que el gasto)

No hace falta cambiarlo si ya te funciona en gasto. Por si lo armas de cero o añadiste/quitaste opciones:

| Opción del menú | Pega esto en `CuentaID` |
| --- | --- |
| Efectivo | `3cff454b563081889c8bdf74ffc31235` |
| Nequi | `3cff454b5630812caee9f2aa97341659` |
| Transferencia | `3cff454b5630812caee9f2aa97341659` |
| Bancolombia | `3cff454b563081f3887ce59cfc38b8ea` |
| Daviplata | `3cff454b563081b19c7aeb28129e2ce0` |
| Tarjeta crédito | `3cff454b563081388987d52aff5b75ad` |

`Nequi` y `Transferencia` son la **misma** cuenta en Notion (`3cff454b5630812caee9f2aa97341659`). Usa el nombre que ya tienes en el atajo de gasto.

Para un salario suele ser **Bancolombia**. Si esa opción no está en tu menú, **Añadir nuevo elemento** → `Bancolombia` → `CuentaID` = `3cff454b563081f3887ce59cfc38b8ea`.

### Qué cambiar en el JSON

En la acción **Texto**, cambia **solo** esta línea:

```json
"Tipo": { "select": { "name": "Gasto" } },
```

por:

```json
"Tipo": { "select": { "name": "Ingreso" } },
```

El resto del JSON es idéntico, con las mismas burbujas `CONCEPTO`, `VALOR`, `FECHAHOY`, `CATEGORIAID`, `CUENTAID`.

Texto completo para copiar si prefieres rehacer la acción Texto:

```json
{
  "parent": {
    "database_id": "c1642803748248acba245c31686ff821"
  },
  "properties": {
    "Concepto": {
      "title": [{ "text": { "content": "CONCEPTO" } }]
    },
    "Valor": { "number": VALOR },
    "Tipo": { "select": { "name": "Ingreso" } },
    "Fecha": { "date": { "start": "FECHAHOY" } },
    "Categoría": {
      "relation": [{ "id": "CATEGORIAID" }]
    },
    "Cuenta": {
      "relation": [{ "id": "CUENTAID" }]
    }
  }
}
```

Sustituye las MAYÚSCULAS por burbujas, igual que en gasto. `VALOR` **sin comillas**.

Encabezados del POST: los mismos (`Authorization`, `Notion-Version` `2022-06-28`, `Content-Type` `application/json`). No copies el token otra vez si al duplicar ya vino.

### Notificación

Cambia el cuerpo a: `Ingreso registrado`.

### Probarlo

1. Ejecuta `💰 Nuevo ingreso`.
2. `2000000` → **Salario** → **Bancolombia** (o la cuenta donde te cae el sueldo).
3. Banner: **Ingreso registrado**.
4. En [Mayores gastos](https://app.notion.com/p/c1642803748248acba245c31686ff821) debe salir un movimiento tipo **Ingreso**, $2.000.000, categoría Salario, fecha de hoy.
5. En el hub [Finanzas](https://app.notion.com/p/3cff454b5630814690fec87bfbd8b82a) el número verde de ingresos debe subir.

### Centro de control

Igual que el de gasto:

1. Ajustes → **Centro de control**.
2. **Añadir un control** → **Atajo**.
3. Toca el control nuevo → elige `💰 Nuevo ingreso`.

---

## Atajo 3 — `📊 Ver finanzas` (abrir el dashboard)

Este **no** usa la API ni el token. Solo abre la página del hub.

| Qué | Valor |
| --- | --- |
| Nombre del atajo | `📊 Ver finanzas` |
| ID de la página | `3cff454b5630814690fec87bfbd8b82a` |
| URL (abre Notion) | `https://www.notion.so/3cff454b5630814690fec87bfbd8b82a` |
| URL alternativa (fuerza la app) | `notion://www.notion.so/3cff454b5630814690fec87bfbd8b82a` |

### Paso a paso

1. App **Atajos** → **+**.
2. Nombre: `📊 Ver finanzas`.
3. Busca **Abrir URL** (no “Obtener el contenido de la URL”; esa es la del POST).
4. Pega:

```text
https://www.notion.so/3cff454b5630814690fec87bfbd8b82a
```

Si Safari se queda en medio, borra esa URL y usa:

```text
notion://www.notion.so/3cff454b5630814690fec87bfbd8b82a
```

5. **Hecho**.
6. Ejecuta el atajo: tiene que abrir el hub **Finanzas** (ingresos, gastos, donut, mayores gastos, presupuestos).

Opcional, una notificación no hace falta: la “confirmación” es ver la página.

### Centro de control

1. Ajustes → **Centro de control**.
2. **Añadir un control** → **Atajo**.
3. Asígnale `📊 Ver finanzas`.

En el Centro de control **no hay vista previa con números**. Un control de Atajos es un botón: lo tocas y entra al dashboard. Eso es lo que iOS permite ahí.

### Vista previa de verdad (números en la pantalla, sin abrir Notion)

Eso no va en el Centro de control. Va en la **pantalla de inicio**, widget nativo de Notion:

1. En Notion, abre [Finanzas](https://www.notion.so/3cff454b5630814690fec87bfbd8b82a) y márcala como **favorita** (estrella). ID de esa página: `3cff454b5630814690fec87bfbd8b82a`.
2. Fondo de pantalla → **Editar** → **Añadir widget**.
3. Busca **Notion**.
4. Tamaño **mediano** o **grande** (el pequeño casi no muestra números).
5. Toca el widget → elige la página **Finanzas**.

Ahí sí ves un recorte del dashboard (totales / donut según lo que Notion alcance a pintar). Un tap abre la página completa, la misma que el atajo `📊 Ver finanzas`.

Resumen:

| Dónde | Qué ves | Atajo / widget |
| --- | --- | --- |
| Centro de control | Botón, sin números | `💰 Nuevo ingreso` y `📊 Ver finanzas` |
| Pantalla de inicio | Recorte del hub | Widget **Notion** → página Finanzas `3cff454b5630814690fec87bfbd8b82a` |

---

## Si algo falla

| Qué ves | Qué revisar |
| --- | --- |
| iOS no deja conectar | En el aviso, Permitir. Ajustes → Atajos → (tu atajo) permisos de red. |
| **401** | El token está mal, con salto de línea, o falta el espacio después de `Bearer`. |
| **404** | La integración no está conectada a Mayores gastos. |
| **400** / validation | `Valor` entre comillas, o un `CategoriaID` mal pegado, o `Tipo` distinto de `Gasto`/`Ingreso`. |
| El gasto sale pero sin categoría | El `CategoriaID` de esa opción del menú está vacío o con un espacio. |
| No aparece en el mes | Revisa que `FechaHoy` sea `yyyy-MM-dd` (año con 4 cifras). |

Más IDs (si creas una cuenta nueva): [notion-ids.md](notion-ids.md).
