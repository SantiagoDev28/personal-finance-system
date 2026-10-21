# Flujo de desarrollo

Hay tres ramas permanentes y, por cada incidencia, una rama de corta duración. Esa rama lleva la clave `PER-<número>`. Cada incidencia de Jira pertenece al proyecto `PER`. El commit sigue [Conventional Commits](https://www.conventionalcommits.org/) y nombra esa misma incidencia para que Jira enlace el cambio.

```text
feature/PER-12-guardar-page-id   (corta; también fix/, chore/, refactor/)
    → laboratory
    → integration (se crean y se ejecutan los tests)
    → main (versión lista para producción)
```

## Ramas permanentes

| Rama | Para qué |
| --- | --- |
| `laboratory` | Recibe el desarrollo ya hecho en la rama corta. |
| `integration` | Tests. Aquí se crean y se ejecutan. |
| `main` | Producción. Solo entra lo que ya pasó por `integration`. |

## Rama de corta duración

Cada incidencia se trabaja en una rama propia, creada desde `laboratory`. Dura lo que dura esa incidencia: al integrarse en `laboratory`, se elimina.

El nombre lleva el tipo y la clave, con guion y sin espacio:

```text
<tipo>/PER-<número>-<descripción-corta>
```

| Tipo | Cuándo |
| --- | --- |
| `feature` | Una capacidad nueva |
| `fix` | Una corrección |
| `chore` | Mantenimiento |
| `refactor` | Un cambio interno |

Esos cuatro tipos son los que pueden entrar a `laboratory`. Ejemplos: `feature/PER-12-guardar-page-id`, `fix/PER-18-valor-negativo`.

El pull request de la rama corta apunta a `laboratory`.

Un cambio avanza así:

1. La incidencia existe en Jira como `PER-<número>`.
2. Desde `laboratory` se crea la rama corta `<tipo>/PER-<número>-<descripción-corta>`.
3. El desarrollo se hace en esa rama, en commits pequeños. Cada commit lleva la misma clave.
4. La rama corta se integra en `laboratory` mediante pull request y después se elimina.
5. Ese cambio se integra en `integration` mediante pull request.
6. En `integration` se escriben y se ejecutan los tests de esa incidencia. Esos commits también llevan la misma clave.
7. Cuando los tests pasan, el cambio se integra en `main` mediante pull request.
8. `laboratory` se actualiza con lo que quedó en `main`, para que la siguiente rama corta parta de la versión ya publicada.

`main` no recibe la rama corta ni trabajo directo de `laboratory`.

## Conventional Commits

Formato:

```text
tipo(ámbito): descripción en imperativo
```

El ámbito puede omitirse. La descripción dice qué cambió, en una frase corta.

| Tipo | Cuándo |
| --- | --- |
| `feat` | Una capacidad nueva |
| `fix` | Una corrección |
| `test` | Tests, sin cambiar el comportamiento |
| `refactor` | Un cambio interno que no altera lo que el sistema hace |
| `docs` | Solo documentación |
| `chore` | Tareas de mantenimiento que no son producto ni tests |
| `build` | Dependencias o el sistema de build |

Un commit es un cambio coherente. El mensaje no usa palabras vacías como `cambios`, `arreglos` o `update`.

## Clave PER y smart commits

La clave del proyecto es `PER`. Cada commit que responde a una incidencia incluye `PER-<número>`, con guion y sin espacio: `PER-12`.

Jira enlaza el commit cuando ve esa clave. Un smart commit, además, ejecuta una acción sobre la incidencia. Solo corre después de hacer push, y solo si el repositorio está conectado al proyecto en Jira.

La línea del smart commit puede ir en el cuerpo del mensaje. El asunto sigue siendo un Conventional Commit.

```text
<texto libre> PER-<número> <texto libre> #<comando> <argumentos>
```

| Comando | Efecto |
| --- | --- |
| `#comment <texto>` | Deja un comentario en la incidencia. El texto llega hasta el siguiente `#`. |
| `#time <cantidad>` | Registra tiempo. Unidades: `w`, `d`, `h`, `m`. Ejemplo: `#time 1h 30m`. |
| `#<transición>` | Mueve la incidencia. El nombre tiene que coincidir con una transición del flujo de Jira. |

Varias claves y varios comandos pueden ir en el mismo mensaje. Un comando cuyo nombre no existe en el flujo no hace nada.

Ejemplos:

```text
feat(ingesta): guardar el page_id del movimiento

PER-12 #comment El registro queda ligado a la fila de Notion.
```

```text
test(ingesta): cubrir un movimiento sin categoría

PER-12 #comment Prueba creada y ejecutada en integration.
```

```text
fix(dominio): rechazar un valor negativo

PER-18 #comment El valor se guarda positivo. #time 30m
```

El token de Notion y cualquier secreto quedan fuera del commit. `.env` no se versiona.
