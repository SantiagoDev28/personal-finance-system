# Finanzas personales

Registro de ingresos y gastos en PostgreSQL. NestJS valida cada movimiento, lo guarda, lo lista, lo edita, lo borra y calcula ingresos, gastos y saldo. El saldo no es una columna: sale de las filas. Al reiniciar el servidor, los movimientos siguen.

La moneda es COP y el monto se guarda como un peso entero positivo. El tipo dice si suma o resta. La decisión está en [docs/decisions/ADR-0001-dinero-moneda-y-fecha.md](docs/decisions/ADR-0001-dinero-moneda-y-fecha.md). El sprint siguiente apunta el atajo del iPhone a esta API, como dice [docs/decisions/ADR-0005-atajo-a-la-api.md](docs/decisions/ADR-0005-atajo-a-la-api.md).

## Instalación

```bash
pnpm install
```

## Pruebas

```bash
pnpm test
```

Jest corre las pruebas del dominio y del servicio en memoria. No abre PostgreSQL.

Los flujos de alta, edición, borrado, filtro, saldo y reinicio corren en otra base, `personal_finance_test`:

```bash
pnpm test:db
```

Ese comando crea la base de prueba si no existe, aplica las migraciones y no escribe en `personal_finance`. PostgreSQL tiene que estar en marcha y el `.env` tiene que poder conectar.

## Lint y formato

```bash
pnpm run format
pnpm run lint
```

`pnpm run format` reescribe `src/**/*.ts` y `test/**/*.ts` con Prettier. `pnpm run lint` ejecuta ESLint sobre el proyecto y corrige lo que la configuración permite. Los dos comandos tienen que terminar sin error.

## Base local

PostgreSQL queda instalado en la máquina. La aplicación Nest no corre en Docker. La decisión de usar SQL explícito, sin ORM, está en [docs/decisions/ADR-0004-acceso-postgresql.md](docs/decisions/ADR-0004-acceso-postgresql.md).

1. Instala PostgreSQL 16 y deja el servicio escuchando en el puerto `5432`.
2. En `psql`, como superusuario de esa instalación:

```sql
CREATE USER finance WITH PASSWORD 'finance_local_only';
CREATE DATABASE personal_finance OWNER finance;
```

3. Copia el ejemplo. Los valores son ficticios y `.env` no se versiona.

```bash
cp .env.example .env
```

En PowerShell:

```powershell
Copy-Item .env.example .env
```

4. Aplica las migraciones. Crean la tabla del movimiento en una base vacía: `id` único, monto entero mayor que 0, tipo `income` o `expense`, categoría, cuenta y un índice por fecha. Volver a ejecutarlas no duplica la tabla. Si la tabla todavía tiene la columna `method`, la renombran a `account`.

```bash
pnpm db:migrate
```

## Arranque

```bash
pnpm run start:dev
```

Sin `.env`, o con `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD` o `DATABASE_NAME` vacíos, el proceso escribe qué falta y termina. No abre el puerto. Si las variables están y PostgreSQL rechaza la conexión, el proceso también termina y muestra el error.

Con la base creada y el `.env` presente, el servidor queda en [http://localhost:3000](http://localhost:3000). Un movimiento creado sigue en la lista después de reiniciar.

## Probar un movimiento y el saldo

El cuerpo es el formulario del atajo: monto, categoría, cuenta, fecha `yyyy-MM-dd` y tipo. No hace falta `id`, `description` ni `method`. Si no viene `id`, la respuesta trae el que asigna el servidor. La fecha se guarda como el inicio de ese día en UTC, como dice [docs/decisions/ADR-0002-rango-de-fechas.md](docs/decisions/ADR-0002-rango-de-fechas.md). El concepto del movimiento es la categoría elegida.

Crear un ingreso:

```bash
curl -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -d "{\"amount\":100000,\"category\":\"Salario\",\"account\":\"Bancolombia\",\"type\":\"income\",\"date\":\"2026-11-15\"}"
```

Crear un gasto:

```bash
curl -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -d "{\"amount\":18000,\"category\":\"Alimentación\",\"account\":\"Efectivo\",\"type\":\"expense\",\"date\":\"2026-11-15\"}"
```

Ver la lista y el saldo:

```bash
curl http://localhost:3000/transactions
curl http://localhost:3000/transactions/resume
```

Con esos dos movimientos la respuesta del saldo es ingresos `100000`, gastos `18000` y saldo `82000`.

Un monto `0`, negativo o con decimales responde `400` y no aparece en la lista. El tipo acepta `income` o `expense`. Un gasto acepta Alimentación, Transporte, Hogar, Tecnología, Educación, Deporte, Ropa, Entretenimiento, Suscripciones u Otros. Un ingreso acepta Salario, Freelance u Otros ingresos. La cuenta acepta Efectivo, Nequi, Bancolombia, Daviplata o Tarjeta crédito. Esos textos se guardan tal cual. Un `id` repetido responde `409`.

## Corregir, borrar y filtrar

En la URL va el `id` que devolvió el alta. Editar el monto del gasto:

```bash
curl -X PATCH http://localhost:3000/transactions/{id} \
  -H "Content-Type: application/json" \
  -d "{\"amount\":20000}"
```

Borrarlo:

```bash
curl -X DELETE http://localhost:3000/transactions/{id}
```

Filtrar la lista y el saldo. `startDate` abre el día y `endDate` lo incluye hasta el último instante, como dice [docs/decisions/ADR-0002-rango-de-fechas.md](docs/decisions/ADR-0002-rango-de-fechas.md).

```bash
curl "http://localhost:3000/transactions?type=expense&category=Alimentación&startDate=2026-09-01&endDate=2026-09-30"
curl "http://localhost:3000/transactions/resume?type=expense&startDate=2026-09-01&endDate=2026-09-30"
```

El saldo de ese filtro usa el mismo cálculo que el saldo total.

## Documentación

El mapa del repositorio está en [docs/README.md](docs/README.md).
