# ADR 0004: Acceso a PostgreSQL con SQL explícito

Estado: aceptada.

La aplicación habla con PostgreSQL mediante SQL explícito. Esta decisión elige la herramienta antes de crear la tabla del movimiento.

## Contexto

[ADR 0003](ADR-0003-captura-directa.md) deja PostgreSQL como el archivo permanente. El servidor ya registra, edita, borra, filtra y calcula el saldo, y esa lista sigue en memoria. Hace falta una sola forma de abrir la base, sin escribir todavía el esquema ni cambiar esas operaciones.

## Decisión

**Herramienta.** SQL explícito con el cliente `pg` (node-postgres). No se añade un ORM. Prisma no entra.

**Configuración.** La conexión se declara en el entorno, nunca en el código:

- `DATABASE_HOST`
- `DATABASE_PORT`
- `DATABASE_USER`
- `DATABASE_PASSWORD`
- `DATABASE_NAME`

`.env.example` trae valores ficticios. `.env` no se versiona.

**Arranque.** Antes de escuchar HTTP, el proceso lee esas variables y abre una conexión. Si falta una variable, o si PostgreSQL no acepta la conexión, el proceso escribe el motivo y termina. No abre el puerto.

**Datos de hoy.** Esa comprobación no crea tablas y no guarda movimientos. Crear, listar, editar, borrar, filtrar y el saldo siguen en memoria. La tabla llega en la tarea siguiente.

La aplicación Nest no se dockeriza en este paso. PostgreSQL se instala en la máquina.

## Alternativas

- Prisma, o Prisma y SQL a la vez. Se descartó: V0.3 pide una sola herramienta, y el aprendizaje de este tramo es el SQL y las restricciones.
- Arrancar aunque falte la configuración y fallar en la primera consulta. Se descartó: el proceso quedaría en silencio hasta que alguien llame a la base.
- Dockerizar Nest junto con la base. Se descartó: esta tarea solo deja la base local y la configuración.

## Consecuencias

- Quien arranque el servidor necesita un PostgreSQL local y un `.env` completo.
- Un movimiento creado hoy se pierde al reiniciar. La persistencia de esas operaciones es el paso posterior.
- El cliente `pg` queda disponible para las migraciones. Esta decisión no crea la tabla.
