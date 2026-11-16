# Guía: crear los atajos en el iPhone

`💸 Nuevo gasto` y `💰 Nuevo ingreso` preguntan el monto, la categoría y la cuenta, arman un JSON y hacen `POST` a la API. PostgreSQL guarda el movimiento. La decisión está en [../decisions/ADR-0005-atajo-a-la-api.md](../decisions/ADR-0005-atajo-a-la-api.md). El cuerpo es el de [el README](../../README.md#probar-un-movimiento-y-el-saldo).

Haz esto **en el iPhone**, app **Atajos**. El atajo no llama a `api.notion.com` y no lleva token, `database_id` ni `page_id`.

`📊 Ver finanzas` y el widget de Notion siguen abriendo el hub. No registran el movimiento. Esa parte queda al final y no cambia en esta guía.

Vas a dejar así dos atajos:

1. `💸 Nuevo gasto` — envía `type` `expense`
2. `💰 Nuevo ingreso` — duplicado del primero, con `type` `income`

Al final los añades al **Centro de control**.

---

## Antes: el servidor al alcance del iPhone

El teléfono no puede usar `localhost`: esa palabra, en el iPhone, es el propio teléfono. El POST va a la IP de este equipo, puerto `3000`.

1. En el equipo, con PostgreSQL en marcha, arranca la API:

```bash
pnpm run start:dev
```

2. El iPhone y el equipo tienen que estar en la misma red.
3. En PowerShell, anota la IPv4 de esa red:

```powershell
ipconfig
```

4. Arma la URL. Si la IPv4 fuera `192.168.1.20`, queda:

```text
http://192.168.1.20:3000/transactions
```

Usa la IPv4 que salió en tu equipo. No pegues el ejemplo si no es la tuya.

5. La primera vez, iOS pregunta si el atajo puede conectarse a esa dirección. Toca **Permitir**. Si no llega, el firewall del equipo tiene que dejar entrar el puerto `3000`.

No hace falta integración de Notion ni token para estos dos atajos.

---

## Atajo 1 — `💸 Nuevo gasto`

### Abrir un atajo vacío

Si ya tienes el atajo que escribía en Notion, entra con el lápiz y sustituye el JSON, la URL y la notificación. Borra el token, los encabezados `Authorization` y `Notion-Version`, y las variables `CategoriaID` y `CuentaID`. El menú se queda; lo que cambia es que el texto elegido viaja tal cual.

Si partes de cero:

1. Abre la app **Atajos**.
2. Toca **+**.
3. Toca el nombre **Atajo nuevo** y cámbialo a `💸 Nuevo gasto`.
4. Abajo, **Buscar apps y acciones**. Cada bloque se apila de arriba a abajo.

---

### Acción 1 — Preguntar el valor

1. Busca **Pedir entrada**.
2. Pregunta: `¿Cuánto?`
3. Tipo de entrada: **Número**.
4. Apaga los decimales.
5. **Definir variable**. Nombre: `Valor`. Valor: la burbuja **Entrada proporcionada**.

Un cero, un negativo o un decimal pueden teclearse igual. La API los rechaza. El atajo no debe decir que quedaron registrados: eso se arma en la última acción.

---

### Acción 2 — Elegir categoría

1. Busca **Elegir del menú**.
2. Indicación: `Categoría`.
3. Deja estas 10 opciones, **con exactamente este texto**:

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

4. No pongas nada dentro de cada opción. No hay id de Notion.
5. **Fuera** del menú, **Definir variable**:
   - Nombre: `Categoria`
   - Valor: la burbuja **Elegir del menú**

Ese texto es la categoría que se guarda. Si eliges Alimentación, el cuerpo lleva `Alimentación`.

---

### Acción 3 — Elegir cuenta

1. **Elegir del menú**.
2. Indicación: `Cuenta`.
3. Opciones, con este texto:

   - Efectivo
   - Nequi
   - Nu
   - Daviplata
   - Tarjeta crédito

4. Fuera del menú, **Definir variable** `Cuenta` = la burbuja **Elegir del menú**.

`Transferencia` no va en este menú. La API no la acepta.

---

### Acción 4 — Fecha de hoy

1. Busca **Fecha**. Déjala en **Fecha actual**.
2. Busca **Formatear fecha**.
3. Fecha: la burbuja de la acción Fecha.
4. Formato: **Personalizado**.
5. Escribe exactamente: `yyyy-MM-dd`
6. **Definir variable** `FechaHoy` = el resultado de Formatear fecha.

---

### Acción 5 — El JSON

1. Busca **Texto**.
2. Pega esto y luego cambia las palabras en mayúsculas por burbujas:

```json
{
  "amount": VALOR,
  "category": "CATEGORIA",
  "account": "CUENTA",
  "date": "FECHAHOY",
  "type": "expense"
}
```

| En el texto borra | Inserta la variable |
| --- | --- |
| `VALOR` | `Valor` |
| `CATEGORIA` | `Categoria` |
| `CUENTA` | `Cuenta` |
| `FECHAHOY` | `FechaHoy` |

`type` se queda escrito: `expense`. No se pregunta. Nuevo gasto es un gasto.

`VALOR` va **sin comillas**. La categoría, la cuenta y la fecha sí van entre comillas.

```text
"amount": Valor          ← correcto
"amount": "Valor"        ← incorrecto
```

Un gasto de 15000 en Alimentación y Efectivo, con fecha de hoy `2026-11-15`, sale así:

```json
{
  "amount": 15000,
  "category": "Alimentación",
  "account": "Efectivo",
  "date": "2026-11-15",
  "type": "expense"
}
```

---

### Acción 6 — Enviar a la API

1. Busca **Obtener el contenido de la URL**.
2. URL: la de tu equipo, terminada en `/transactions`. Ejemplo de forma, no de dirección:

```text
http://192.168.1.20:3000/transactions
```

3. **Método**: `POST`.
4. Un solo encabezado:

| Encabezado | Valor |
| --- | --- |
| `Content-Type` | `application/json` |

No añadas `Authorization` ni `Notion-Version`. No pegues un token.

5. **Cuerpo de la solicitud**: **Archivo**, y elige la burbuja de la acción **Texto**. Si iOS pide **JSON** en vez de Archivo, usa el mismo Texto.

---

### Acción 7 — Confirmar solo si quedó creado

La notificación de éxito va **dentro** de un si. Si el monto es inválido, la API responde 400, no devuelve `id` y el atajo no dice que quedó registrado.

1. Busca **Obtener valor del diccionario**.
2. Clave: `id`.
3. Diccionario: el contenido de la URL. Si Atajos te deja el resultado como texto, antes añade **Obtener diccionario de la entrada** con ese contenido.
4. Busca **Si**.
5. Condición: el valor `id` **tiene algún valor**.
6. Dentro del si, **Mostrar notificación**. Título: `Finanzas`. Cuerpo: `Gasto registrado`.
7. En **Si no**, no escribas «registrado». Puedes poner `No se registró` para ver el rechazo.

Si la acción de la URL se detiene al recibir un 400, el si no se ejecuta. Tampoco aparece «Gasto registrado».

---

### Cómo queda el atajo

```text
Pedir entrada (número) ¿Cuánto?
Definir variable Valor
Elegir del menú Categoría  →  variable Categoria
Elegir del menú Cuenta     →  variable Cuenta
Fecha actual
Formatear fecha yyyy-MM-dd
Definir variable FechaHoy
Texto (JSON, type expense)
Obtener contenido de URL  POST /transactions
Si la respuesta trae id
    Mostrar notificación  Gasto registrado
Si no
    Mostrar notificación  No se registró
```

Toca **Hecho**.

---

### Probar el gasto

1. Deja `pnpm run start:dev` corriendo.
2. En el iPhone, ejecuta `💸 Nuevo gasto`.
3. `15000` → **Alimentación** → **Efectivo**.
4. El banner dice **Gasto registrado** solo si la API creó la fila.
5. En el equipo:

```bash
curl http://localhost:3000/transactions
curl http://localhost:3000/transactions/resume
```

Tiene que aparecer el gasto: monto `15000`, categoría `Alimentación`, cuenta `Efectivo`, tipo `expense`. El saldo cuadra con las filas.

6. Para el servidor con Ctrl+C y vuelve a arrancar `pnpm run start:dev`. El mismo `GET /transactions` sigue mostrando el movimiento.
7. En Notion, la base de movimientos no tiene una página nueva por esta captura.
8. Ejecuta otra vez el atajo con monto `0`. El banner no dice **Gasto registrado**. Ese cero no aparece en `GET /transactions`.

---

## Atajo 2 — `💰 Nuevo ingreso`

Duplica el de gasto y cambia el menú, el tipo y el texto del banner.

1. Mantén pulsado `💸 Nuevo gasto` → **Duplicar**.
2. Entra al duplicado y nómbralo `💰 Nuevo ingreso`.
3. En **Categoría**, borra las 10 opciones de gasto. Deja solo estas, con este texto:

   - Salario
   - Freelance
   - Barberia
   - Otros ingresos

4. La variable `Categoria` sigue siendo la burbuja **Elegir del menú**, fuera del menú.
5. El menú **Cuenta** no se toca: Efectivo, Nequi, Nu, Daviplata, Tarjeta crédito.
6. En el JSON, cambia solo el tipo:

```json
"type": "income"
```

El resto del cuerpo sigue con las burbujas `Valor`, `Categoria`, `Cuenta` y `FechaHoy`. `Valor` sin comillas. Texto completo:

```json
{
  "amount": VALOR,
  "category": "CATEGORIA",
  "account": "CUENTA",
  "date": "FECHAHOY",
  "type": "income"
}
```

7. La URL, el método `POST` y el encabezado `Content-Type` quedan igual. Siguen sin token.
8. Dentro del si, el cuerpo de la notificación pasa a `Ingreso registrado`. El si no sigue sin decir «registrado».

### Probar el ingreso

1. Ejecuta `💰 Nuevo ingreso`.
2. `2000000` → **Barberia** → **Nu**.
3. Banner: **Ingreso registrado**, solo si la respuesta trae `id`.
4. `GET /transactions` muestra una fila `income` con categoría `Barberia` y cuenta `Nu`.
5. `GET /transactions/resume` cuadra con las filas, incluido el gasto de antes si sigue ahí.
6. Notion no recibe una página por este ingreso.
7. Reinicia el servidor y vuelve a listar: el ingreso sigue.

### Centro de control

1. Ajustes → **Centro de control**.
2. **Añadir un control** → **Atajo**.
3. Asigna `💸 Nuevo gasto` y `💰 Nuevo ingreso`.

---

## Atajo 3 — `📊 Ver finanzas`

Este atajo no registra movimientos. Sigue abriendo el hub de Notion. No usa `POST /transactions` ni el token.

| Qué | Valor |
| --- | --- |
| Nombre del atajo | `📊 Ver finanzas` |
| URL | `https://www.notion.so/3cff454b5630814690fec87bfbd8b82a` |
| URL alternativa | `notion://www.notion.so/3cff454b5630814690fec87bfbd8b82a` |

1. App **Atajos** → **+**.
2. Nombre: `📊 Ver finanzas`.
3. **Abrir URL** (no «Obtener el contenido de la URL»).
4. Pega la URL de la tabla. Si Safari se queda en medio, usa la que empieza por `notion://`.
5. **Hecho**.

El widget de Notion en la pantalla de inicio también solo abre el hub. No crea filas en PostgreSQL.

---

## Si algo falla

| Qué ves | Qué revisar |
| --- | --- |
| El iPhone no conecta | La URL usa la IPv4 del equipo, no `localhost`. El servidor está en marcha. El firewall deja el puerto `3000`. En el aviso de iOS, Permitir. |
| **400** y banner `No se registró` | Monto cero, negativo o con decimales. O la categoría o la cuenta no coinciden letra por letra con el menú. |
| El banner dice registrado y la lista no cambia | La URL no es `/transactions` de esta API, o el `GET` apunta a otro equipo. |
| La categoría no queda como la tocaste | `Categoria` no es la burbuja del menú, o el texto de la opción tiene un espacio de más. |
| La fecha cae en otro día | `FechaHoy` tiene que ser `yyyy-MM-dd`, año con 4 cifras. |
| Aparece una página nueva en Notion | El atajo viejo sigue en uso: la URL todavía es `api.notion.com`. |
