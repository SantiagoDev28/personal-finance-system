# Finanzas personales

Registro de ingresos y gastos en memoria. NestJS valida cada movimiento, lo guarda, lo lista, lo edita, lo borra y calcula ingresos, gastos y saldo. El arranque exige un PostgreSQL local, pero las filas siguen en memoria: al reiniciar el servidor la lista vuelve a quedar vacía.

La moneda es COP y el monto se guarda como un peso entero positivo. El tipo dice si suma o resta. La decisión está en [docs/decisions/ADR-0001-dinero-moneda-y-fecha.md](docs/decisions/ADR-0001-dinero-moneda-y-fecha.md). El camino siguiente, atajo → API → PostgreSQL, está en [docs/decisions/ADR-0003-captura-directa.md](docs/decisions/ADR-0003-captura-directa.md).

## Instalación

```bash
pnpm install
```

## Pruebas

```bash
pnpm test
```

Jest corre las pruebas del dominio y del servicio en memoria. No hace falta levantar el servidor ni una base de datos.

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

## Arranque

```bash
pnpm run start:dev
```

Sin `.env`, o con `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD` o `DATABASE_NAME` vacíos, el proceso escribe qué falta y termina. No abre el puerto. Si las variables están y PostgreSQL rechaza la conexión, el proceso también termina y muestra el error.

Con la base creada y el `.env` presente, el servidor queda en [http://localhost:3000](http://localhost:3000). Los movimientos de esa sesión siguen en memoria.

## Probar un movimiento y el saldo

Crear un ingreso:

```bash
curl -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -d "{\"id\":\"mov-1\",\"amount\":100000,\"description\":\"Salario\",\"category\":\"other\",\"method\":\"transfer\",\"type\":\"income\",\"date\":\"2026-09-02T00:00:00.000Z\"}"
```

Crear un gasto:

```bash
curl -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -d "{\"id\":\"mov-2\",\"amount\":18000,\"description\":\"Almuerzo\",\"category\":\"food\",\"method\":\"cash\",\"type\":\"expense\",\"date\":\"2026-09-02T00:00:00.000Z\"}"
```

Ver la lista y el saldo:

```bash
curl http://localhost:3000/transactions
curl http://localhost:3000/transactions/resume
```

Con esos dos movimientos la respuesta del saldo es ingresos `100000`, gastos `18000` y saldo `82000`.

Un monto `0` responde `400` y no aparece en la lista. `category` acepta `food`, `transportation`, `housing`, `utilities`, `entertainment` u `other`. `method` acepta `cash`, `credit_card`, `debit_card`, `transfer` u `other`. `type` acepta `income` o `expense`. Un `id` repetido responde `409`.

## Corregir, borrar y filtrar

Editar el monto del gasto:

```bash
curl -X PATCH http://localhost:3000/transactions/mov-2 \
  -H "Content-Type: application/json" \
  -d "{\"amount\":20000}"
```

Borrarlo:

```bash
curl -X DELETE http://localhost:3000/transactions/mov-2
```

Filtrar la lista y el saldo. `startDate` abre el día y `endDate` lo incluye hasta el último instante, como dice [docs/decisions/ADR-0002-rango-de-fechas.md](docs/decisions/ADR-0002-rango-de-fechas.md).

```bash
curl "http://localhost:3000/transactions?type=expense&category=food&startDate=2026-09-01&endDate=2026-09-30"
curl "http://localhost:3000/transactions/resume?type=expense&startDate=2026-09-01&endDate=2026-09-30"
```

El saldo de ese filtro usa el mismo cálculo que el saldo total.

## Documentación

El mapa del repositorio está en [docs/README.md](docs/README.md).
