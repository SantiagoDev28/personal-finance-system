# Finanzas personales

Registro de ingresos y gastos en memoria. NestJS guarda cada movimiento que ya pasó la validación, los lista y calcula ingresos, gastos y saldo. No hay base de datos: al reiniciar el servidor la lista vuelve a quedar vacía.

La moneda es COP y el monto se guarda como un peso entero positivo. El tipo dice si suma o resta. La decisión está en [docs/decisions/ADR-0001-dinero-moneda-y-fecha.md](docs/decisions/ADR-0001-dinero-moneda-y-fecha.md).

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

## Arranque

```bash
pnpm run start:dev
```

El servidor queda en [http://localhost:3000](http://localhost:3000).

## Probar un movimiento y el saldo

Crear un ingreso:

```bash
curl -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -d "{\"id\":\"mov-1\",\"amount\":100000,\"description\":\"Salario\",\"category\":\"Salario\",\"method\":\"transfer\",\"type\":\"income\",\"date\":\"2026-09-02T00:00:00.000Z\"}"
```

Crear un gasto:

```bash
curl -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -d "{\"id\":\"mov-2\",\"amount\":18000,\"description\":\"Almuerzo\",\"category\":\"Alimentacion\",\"method\":\"cash\",\"type\":\"expense\",\"date\":\"2026-09-02T00:00:00.000Z\"}"
```

Ver la lista y el saldo:

```bash
curl http://localhost:3000/transactions
curl http://localhost:3000/transactions/resume
```

Con esos dos movimientos la respuesta del saldo es ingresos `100000`, gastos `18000` y saldo `82000`.

Un monto `0` responde `400` y no aparece en la lista. `method` acepta `cash`, `credit_card`, `debit_card`, `transfer` u `other`. `type` acepta `income` o `expense`.

## Documentación

El mapa del repositorio está en [docs/README.md](docs/README.md).
