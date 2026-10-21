# Personal Finance System

## Documento maestro del proyecto de aprendizaje

**Estado:** planificación inicial\
**Versión del documento:** 1.0\
**Propósito:** aprender ingeniería de software construyendo un producto
real, incremental y documentado.\
**Stack inicial propuesto:** TypeScript, Node.js, PostgreSQL y, cuando
corresponda, NestJS, React, Docker y GitHub Actions.

------------------------------------------------------------------------

## 1. Visión del producto

Personal Finance System será una aplicación web para registrar y
consultar ingresos y gastos, organizar movimientos por categorías y
comprender el estado de las finanzas personales.

No se pretende construir todo desde el primer día. El sistema crecerá
por versiones pequeñas y utilizables. Cada versión debe entregar una
capacidad funcional, pruebas y documentación suficiente para entender
las decisiones tomadas.

### Objetivos de aprendizaje

-   Practicar lógica y TypeScript sin depender completamente de la IA.
-   Diseñar modelos de dominio y persistencia correctos.
-   Aprender a estructurar código mantenible y a refactorizar.
-   Construir una API, probarla y documentarla.
-   Incorporar una interfaz de usuario.
-   Aprender Git con ramas, commits pequeños, pull requests y
    revisiones.
-   Automatizar calidad y despliegues mediante CI/CD.
-   Practicar fundamentos de seguridad, observabilidad y operación.
-   Aprender a utilizar asistentes de IA como apoyo, no como sustitutos
    del criterio técnico.

### Principios de trabajo

1.  **Producto primero:** cada iteración termina con algo demostrable.
2.  **Complejidad justificada:** empezar con un monolito modular; no
    introducir microservicios por moda.
3.  **Pruebas proporcionales al riesgo:** probar especialmente reglas de
    negocio, dinero y persistencia.
4.  **Documentación viva:** documentar decisiones importantes y mantener
    los documentos actualizados.
5.  **Cambios pequeños:** preferir tareas que puedan terminarse en una o
    pocas sesiones.
6.  **Entender antes de delegar:** no aceptar código generado que no
    puedas explicar o verificar.
7.  **Calidad incremental:** no intentar aplicar todas las buenas
    prácticas desde la primera versión.
8.  **Seguridad desde el diseño:** no guardar secretos en el repositorio
    ni publicar datos financieros reales.

------------------------------------------------------------------------

## 2. Alcance funcional y versiones

Las versiones son hitos de producto, no fechas límite. No se avanza
porque haya pasado una semana: se avanza cuando los criterios de
aceptación están satisfechos.

## V0.1 --- Núcleo de dominio en memoria

**Objetivo:** construir y probar la lógica esencial sin base de datos ni
interfaz web.

### Funcionalidades

-   Representar un movimiento financiero.
-   Distinguir ingreso y gasto.
-   Validar monto, descripción, fecha y categoría.
-   Registrar, listar y consultar movimientos.
-   Calcular ingresos, gastos y saldo a partir de los movimientos.
-   Rechazar entradas inválidas con errores claros.

### Aprendizajes

-   TypeScript, tipos y uniones discriminadas.
-   Funciones pequeñas y responsabilidades claras.
-   Inmutabilidad cuando simplifique el razonamiento.
-   Validación y manejo de errores.
-   Pruebas unitarias.
-   Separación entre reglas de negocio y entrada/salida.

### Criterios de aceptación

-   Es posible registrar ingresos y gastos válidos.
-   Un monto cero, negativo o no válido se rechaza según la regla
    definida.
-   El saldo se calcula de manera consistente.
-   Los casos de lista vacía y múltiples movimientos están probados.
-   El dominio puede probarse sin servidor ni base de datos.
-   README explica cómo instalar, probar y ejecutar el proyecto.

**No incluir todavía:** React, NestJS, autenticación, PostgreSQL, Docker
ni arquitectura compleja.

## V0.2 --- Calidad, refactorización y reglas de negocio

**Objetivo:** mejorar el código existente a partir de problemas reales,
sin reescribirlo por estética.

### Funcionalidades

-   Editar y eliminar movimientos.
-   Filtrar movimientos por tipo, categoría y rango de fechas.
-   Definir reglas claras para fechas, moneda y redondeo.
-   Añadir identificadores estables.
-   Evitar duplicar lógica de cálculo.

### Aprendizajes

-   Refactorización segura.
-   Diseño de funciones y módulos.
-   Casos límite y pruebas basadas en comportamiento.
-   Formato y linting automáticos.
-   Convenciones de nombres y commits.

### Criterios de aceptación

-   Las operaciones de editar y eliminar mantienen los cálculos
    correctos.
-   Los filtros combinados funcionan.
-   Las pruebas cubren casos normales y casos límite importantes.
-   El linter y el formateador se ejecutan mediante comandos
    documentados.
-   Los cambios están divididos en commits comprensibles.

## V0.3 --- Persistencia con PostgreSQL

**Objetivo:** guardar datos de forma persistente y comprender las
decisiones de datos.

### Funcionalidades

-   Crear el esquema inicial de base de datos.
-   Guardar, consultar, editar y eliminar movimientos.
-   Incorporar migraciones.
-   Definir restricciones de integridad.
-   Consultar movimientos ordenados por fecha.

### Aprendizajes

-   SQL, claves primarias y foráneas.
-   Restricciones, índices y transacciones.
-   Diferencias entre el modelo de dominio y el modelo persistido.
-   Variables de entorno y configuración local.
-   Manejo de fallos de conexión.

### Criterios de aceptación

-   Los datos sobreviven al reinicio de la aplicación.
-   La estructura de base de datos puede reconstruirse con migraciones.
-   Se documenta cómo crear una base de datos local.
-   No se incluyen contraseñas ni secretos reales en Git.
-   Se prueban los flujos principales contra una base de datos de
    pruebas.

**Decisión pendiente:** escoger una única herramienta de acceso a datos
cuando esta versión lo requiera (por ejemplo, Prisma o SQL explícito).
No introducir un ORM y un query builder sin una necesidad clara.

## V0.4 --- API REST

**Objetivo:** exponer el dominio a través de una API mantenible.

### Funcionalidades

-   Crear endpoints para movimientos.
-   Validar parámetros, cuerpo y consultas.
-   Responder con códigos HTTP adecuados.
-   Incorporar paginación y filtros.
-   Añadir documentación OpenAPI.
-   Estandarizar errores de API.

### Aprendizajes

-   HTTP y diseño de API REST.
-   Controladores, servicios y acceso a datos.
-   DTOs y validación.
-   Inyección de dependencias cuando aporte claridad.
-   Pruebas unitarias y de integración.
-   Contratos de API y versionado básico.

### Criterios de aceptación

-   Los endpoints principales están documentados.
-   Las entradas inválidas generan respuestas consistentes.
-   Los errores internos no exponen secretos ni trazas sensibles al
    cliente.
-   Las pruebas cubren éxito, validación, no encontrado y errores de
    persistencia.
-   Se puede ejecutar la API siguiendo únicamente el README.

**Estructura orientativa:** empezar con módulos claros y límites
sencillos. Aplicar arquitectura hexagonal si aparece una razón concreta
para aislar el dominio de infraestructura; no crear interfaces y capas
vacías por obligación.

## V0.5 --- Resúmenes y consultas financieras

**Objetivo:** producir información útil a partir de los movimientos.

### Funcionalidades

-   Resumen por período.
-   Totales de ingresos y gastos.
-   Saldo neto del período.
-   Agrupación por categoría.
-   Consultas por rango de fechas.

### Aprendizajes

-   Agregaciones SQL.
-   Precisión numérica y representación del dinero.
-   Índices y análisis de consultas.
-   Pruebas con datos variados.
-   Diferencia entre saldo total y resultado de un período.

### Criterios de aceptación

-   Los resúmenes coinciden con los movimientos que los originan.
-   Los períodos y límites de fecha están definidos y probados.
-   La representación monetaria evita errores de punto flotante.
-   Se documentan las reglas de cálculo y moneda.

## V0.6 --- Interfaz web

**Objetivo:** convertir la API en una aplicación utilizable.

### Funcionalidades

-   Listado de movimientos.
-   Formulario de registro y edición.
-   Filtros y paginación.
-   Resumen financiero básico.
-   Estados de carga, vacío y error.
-   Diseño usable en móvil y escritorio.

### Aprendizajes

-   React y TypeScript en el frontend.
-   Formularios y validación.
-   Manejo de estado y solicitudes HTTP.
-   Componentes reutilizables con propósito.
-   Accesibilidad y diseño adaptable.

### Criterios de aceptación

-   Una persona puede completar el flujo principal desde la interfaz.
-   Los errores de API se muestran de manera comprensible.
-   No se confía únicamente en la validación del navegador.
-   Los estados de carga, error y ausencia de datos están resueltos.
-   Se prueban los componentes o flujos críticos.

## V0.7 --- Usuarios, autenticación y autorización

**Objetivo:** permitir que cada usuario gestione sus propios datos de
forma aislada.

### Funcionalidades

-   Registro e inicio de sesión.
-   Cierre de sesión y expiración de sesión.
-   Asociar movimientos a un usuario.
-   Autorizar operaciones en el servidor.
-   Impedir el acceso cruzado a datos de otros usuarios.

### Aprendizajes

-   Autenticación frente a autorización.
-   Hashing de contraseñas con una biblioteca segura.
-   Gestión segura de sesiones o tokens.
-   Protección de secretos, validación y límites de intentos.
-   Pruebas de aislamiento entre usuarios.

### Criterios de aceptación

-   Las contraseñas nunca se almacenan en texto plano.
-   Toda consulta y modificación de datos está limitada al usuario
    autorizado.
-   Los tests intentan explícitamente acceder a datos de otro usuario y
    verifican que se deniega.
-   Los secretos se inyectan desde el entorno.
-   Se documentan los riesgos y las decisiones de autenticación.

**Nota de seguridad:** no desplegar esta versión con datos financieros
reales hasta revisar controles de acceso, configuración y exposición de
secretos.

## V0.8 --- Calidad automatizada y CI

**Objetivo:** detectar regresiones automáticamente en cada cambio.

### Funcionalidades

-   Scripts uniformes para instalar, probar, validar tipos y compilar.
-   Pipeline de CI al abrir o actualizar un pull request.
-   Comprobación de lint, tipos, pruebas y build.
-   Reglas básicas de protección de rama principal.

### Aprendizajes

-   GitHub Actions u otra plataforma equivalente.
-   Integración continua.
-   Reproducibilidad de builds.
-   Pull requests y revisión de cambios.
-   Gestión de dependencias.

### Criterios de aceptación

-   La pipeline se ejecuta automáticamente.
-   Un cambio que rompe pruebas no pasa la validación.
-   Las instrucciones locales coinciden con los comandos de CI.
-   No se exponen secretos en logs ni workflows.

## V0.9 --- Docker y entorno reproducible

**Objetivo:** permitir que otra persona levante el sistema sin
configurar manualmente cada dependencia.

### Funcionalidades

-   Dockerfile para la aplicación.
-   Docker Compose para aplicación y base de datos cuando aplique.
-   Health check.
-   Configuración por variables de entorno.
-   Persistencia local de PostgreSQL.
-   Guía de resolución de problemas comunes.

### Aprendizajes

-   Imágenes, contenedores, volúmenes y redes.
-   Diferencias entre configuración de desarrollo y producción.
-   Logs y comprobaciones de salud.
-   Seguridad básica de imágenes y contenedores.

### Criterios de aceptación

-   Un desarrollador puede levantar el entorno siguiendo la
    documentación.
-   Los datos sobreviven a reinicios según la configuración definida.
-   No se guardan secretos reales en archivos versionados.
-   La aplicación falla con mensajes claros cuando falta una
    configuración requerida.

## V1.0 --- Primer despliegue usable

**Objetivo:** publicar una versión pequeña, estable y demostrable.

### Funcionalidades

-   Despliegue en un proveedor adecuado al presupuesto.
-   HTTPS y configuración de entorno.
-   Migraciones controladas.
-   Logs y monitoreo básico.
-   Copias de seguridad y procedimiento de restauración.
-   Documentación de arquitectura y operación.

### Criterios de aceptación

-   La aplicación está accesible en un entorno publicado.
-   Se ha probado una copia de seguridad y su restauración.
-   La documentación explica despliegue, configuración y recuperación.
-   Los errores se pueden diagnosticar con logs.
-   No se publican datos personales reales en el portafolio.

## V1.1 --- Operación y rendimiento

**Objetivo:** aprender a mantener el producto después del despliegue.

### Funcionalidades posibles

-   Métricas de latencia y errores.
-   Mejoras de índices a partir de consultas observadas.
-   Límites de solicitudes y validación adicional.
-   Mejor manejo de errores externos.
-   Plan de actualización de dependencias.
-   Pruebas de rendimiento acotadas.

### Criterios de aceptación

-   Existe una forma reproducible de observar los problemas principales.
-   Las optimizaciones están justificadas por mediciones.
-   Se documentan riesgos, límites y procedimientos de recuperación.

## V1.2 --- Funcionalidades avanzadas opcionales

Solo cuando las versiones anteriores estén estables: - Presupuestos por
categoría. - Objetivos de ahorro. - Movimientos recurrentes. -
Exportación CSV. - Importación validada. - Notificaciones. - Auditoría
de cambios. - Moneda múltiple, si se define correctamente el tratamiento
de tasas y conversiones.

Cada funcionalidad debe tener alcance y criterios de aceptación propios.
No es obligatorio implementar todas.

------------------------------------------------------------------------

## 3. Reglas de dominio que deben definirse

Estas decisiones deben documentarse antes de implementar funcionalidades
que dependan de ellas:

-   **Moneda:** empezar con una moneda única y explícita. No asumir que
    una cantidad es COP sin declararlo.
-   **Dinero:** no utilizar aritmética binaria de punto flotante como
    representación canónica de cantidades monetarias. Elegir unidades
    menores enteras o un tipo decimal adecuado y documentar la decisión.
-   **Saldo:** definir si se calcula a partir de todos los movimientos o
    si se persiste como una proyección.
-   **Fechas:** definir zona horaria y si las fechas de los movimientos
    son fechas de calendario o instantes temporales.
-   **Borrado:** decidir si un movimiento se elimina físicamente o se
    conserva mediante auditoría; no añadir borrado lógico sin necesidad.
-   **Categorías:** definir si son un conjunto inicial fijo o si los
    usuarios pueden administrarlas.
-   **Propiedad:** desde la versión multiusuario, todo movimiento
    pertenece a un usuario y el servidor verifica esa relación.

Registrar decisiones importantes en `docs/decisions/` como ADRs
(Architecture Decision Records).

------------------------------------------------------------------------

## 4. Estructura recomendada del repositorio

No crear todas las carpetas desde el primer día. Añadirlas cuando el
proyecto las necesite.

``` text
personal-finance-system/
├── README.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── LICENSE
├── .gitignore
├── .editorconfig
├── .env.example
├── docs/
│   ├── product/
│   │   ├── vision.md
│   │   └── roadmap.md
│   ├── architecture/
│   │   └── overview.md
│   ├── decisions/
│   │   └── ADR-0001-example.md
│   ├── development/
│   │   └── workflow.md
│   └── operations/
│       └── runbook.md
├── apps/
│   ├── api/                 # Incorporar cuando exista API
│   └── web/                 # Incorporar cuando exista frontend
├── packages/
│   └── domain/              # Opcional si la separación lo justifica
├── database/
│   └── migrations/
└── .github/
    ├── PULL_REQUEST_TEMPLATE.md
    ├── ISSUE_TEMPLATE/
    └── workflows/
```

### Qué documenta cada archivo

-   `README.md`: qué hace el producto, estado actual, stack,
    instalación, comandos y enlaces a documentación.
-   `CONTRIBUTING.md`: cómo aportar cambios, estilo, pruebas, commits y
    pull requests.
-   `CHANGELOG.md`: cambios relevantes por versión.
-   `.env.example`: nombres y ejemplos ficticios de configuración; nunca
    secretos reales.
-   `docs/product/vision.md`: problema, usuarios, alcance y no
    objetivos.
-   `docs/product/roadmap.md`: versiones, estado y criterios de
    aceptación.
-   `docs/architecture/overview.md`: módulos, dependencias, diagramas y
    flujos importantes.
-   `docs/decisions/`: ADRs con contexto, decisión, alternativas y
    consecuencias.
-   `docs/development/workflow.md`: ramas, commits, revisión y flujo
    local.
-   `docs/operations/runbook.md`: despliegue, logs, backups y
    recuperación, cuando exista operación real.

### Plantilla inicial para README

``` markdown
# Personal Finance System

Descripción breve del problema que resuelve.

## Estado del proyecto
Versión actual: V0.1
Estado: en desarrollo

## Objetivos
- Registrar ingresos y gastos.
- Consultar movimientos y resúmenes.
- Aprender prácticas de ingeniería mediante entregas incrementales.

## Stack
Completar solo con tecnologías realmente utilizadas.

## Requisitos
Indicar versiones necesarias de Node.js y otras dependencias.

## Instalación
Instrucciones reproducibles.

## Comandos
Documentar comandos reales de instalación, pruebas, lint y ejecución.

## Pruebas
Cómo ejecutar las pruebas y qué cubren.

## Roadmap
Enlace a `docs/product/roadmap.md`.

## Decisiones técnicas
Enlace a `docs/decisions/`.

## Seguridad
No incluir datos reales ni secretos. Indicar cómo reportar vulnerabilidades si el proyecto se publica.
```

------------------------------------------------------------------------

## 5. Git: ramas, commits y pull requests

El objetivo no es simular un equipo grande cuando trabajas en solitario.
Es practicar un flujo que tenga sentido profesional sin añadir
burocracia.

### Estrategia de ramas

Usar una rama principal protegida llamada `main` y ramas cortas por
tarea:

-   `feat/PSF-1-create-transaction`
-   `fix/PSF-8-invalid-amount`
-   `test/PSF-12-transaction-service`
-   `docs/PSF-15-update-readme`
-   `refactor/PSF-18-extract-money-rules`
-   `chore/PSF-21-configure-lint`

`PSF` es un prefijo de ejemplo para las incidencias de Jira. Si el
proyecto de Jira utiliza otro identificador, reemplazarlo.

### Flujo normal

1.  Seleccionar una tarea pequeña y confirmar sus criterios de
    aceptación.
2.  Actualizar `main` local.
3.  Crear una rama para esa tarea.
4.  Implementar solo el alcance acordado.
5.  Ejecutar pruebas, lint, chequeo de tipos y build cuando existan.
6.  Revisar el diff y eliminar cambios accidentales.
7.  Crear commits pequeños con mensajes claros.
8.  Abrir un pull request, aunque seas la única persona revisándolo.
9.  Verificar los checks y utilizar una checklist de revisión.
10. Integrar a `main` y cerrar la incidencia de Jira.
11. Eliminar la rama ya integrada.

No mantener ramas abiertas durante semanas. Si una tarea es demasiado
grande, dividirla.

### Convención de commits

Usar Conventional Commits:

``` text
feat(domain): add expense registration
fix(domain): reject invalid monetary amount
test(domain): cover empty transaction list
refactor(domain): isolate balance calculation
docs(readme): document local setup
chore(tooling): configure TypeScript checks
```

Formato:

``` text
type(scope): imperative description
```

Tipos comunes: `feat`, `fix`, `test`, `refactor`, `docs`, `chore` y
`build`.

Un commit debe representar un cambio coherente. Evitar mensajes como
`cambios`, `arreglos`, `update` o `final`.

### Checklist para pull requests

-   [ ] El cambio resuelve la incidencia enlazada.
-   [ ] El alcance se mantiene pequeño.
-   [ ] Las pruebas cubren el comportamiento y los casos límite
    relevantes.
-   [ ] Se ejecutaron los comandos de calidad disponibles.
-   [ ] No se incluyeron secretos, datos personales ni archivos
    generados.
-   [ ] Se revisó el diff completo.
-   [ ] La documentación se actualizó si cambió el comportamiento o la
    forma de ejecutar el proyecto.
-   [ ] La descripción explica qué cambió, por qué y cómo se verificó.

------------------------------------------------------------------------

## 6. Jira: tablero de aprendizaje y desarrollo

Sí, Jira puede ser útil si lo utilizas para visualizar trabajo real y no
para administrar una cantidad excesiva de tareas.

### Configuración inicial

Crear un proyecto Jira llamado `Personal Finance System`,
preferiblemente de tipo **Scrum** si quieres trabajar en sprints cortos,
o **Kanban** si prefieres flujo continuo. Para una sola persona,
cualquiera sirve; elegir uno y mantenerlo simple.

### Tipos de incidencias

-   **Epic:** una versión o área grande, por ejemplo
    `V0.1 — Core domain`.
-   **Story:** una capacidad visible para el usuario.
-   **Task:** trabajo técnico o documental.
-   **Bug:** comportamiento incorrecto que hay que corregir.
-   **Sub-task:** pasos concretos de una incidencia cuando realmente
    aporten claridad.

No convertir cada línea de código en una incidencia. Las tareas deben
describir resultados verificables.

### Columnas del tablero

1.  **Backlog:** ideas y trabajo futuro.
2.  **Selected:** tareas elegidas para la semana o sprint.
3.  **In Progress:** trabajo activo; limitar a una o dos tareas.
4.  **Review / Testing:** implementación terminada, pendiente de
    revisión o validación.
5.  **Done:** criterios de aceptación satisfechos y cambios integrados.

Si la edición de Jira no permite configurar exactamente estos estados,
usar los estados equivalentes disponibles.

### Campos útiles

-   Resumen.
-   Descripción y contexto.
-   Criterios de aceptación.
-   Tipo de incidencia.
-   Prioridad.
-   Epic o versión.
-   Estimación opcional.
-   Enlace al pull request o commit.
-   Notas de aprendizaje, si ayudan a recordar una decisión.

### Plantilla para una incidencia

``` markdown
## Contexto
¿Qué problema o necesidad se resuelve?

## Resultado esperado
¿Qué podrá hacer el sistema cuando termine esta tarea?

## Criterios de aceptación
- [ ] Caso principal funciona.
- [ ] Casos inválidos están definidos.
- [ ] Pruebas relevantes pasan.

## Fuera de alcance
¿Qué no se va a implementar en esta tarea?

## Verificación
Comandos, pruebas o pasos manuales para comprobarlo.

## Aprendizaje
¿Qué concepto técnico quiero entender mejor?
```

### Cómo organizar las versiones

Crear un Epic por cada hito principal (`V0.1`, `V0.2`, etc.) y vincular
las incidencias correspondientes. Para una versión pequeña, un Epic
puede ser suficiente; para un proyecto mayor, se puede organizar por
capacidades de producto y usar versiones/releases de Jira para los
hitos.

No crear todas las incidencias de todas las versiones de una sola vez
con detalle excesivo. Cargar el roadmap completo a nivel de hitos, pero
desglosar en tareas concretas solo la versión actual y, como máximo, la
siguiente.

### Ritmo de trabajo recomendado

-   **Inicio de semana:** elegir entre una y tres tareas realistas.
-   **Cada sesión:** mover la incidencia activa y dejar una nota breve
    del progreso.
-   **Final de semana:** integrar lo terminado, revisar qué aprendiste y
    ajustar el siguiente objetivo.
-   **Cada versión:** verificar los criterios de aceptación antes de
    marcarla como completada.

La meta no es maximizar tickets cerrados; es producir incrementos
funcionales y aprender de ellos.

------------------------------------------------------------------------

## 7. Calidad técnica: qué añadir y cuándo

  -----------------------------------------------------------------------
  Práctica                Cuándo incorporarla     Para qué
  ----------------------- ----------------------- -----------------------
  TypeScript estricto     V0.1                    Detectar errores de
                                                  tipos temprano

  Pruebas unitarias       V0.1                    Proteger reglas de
                                                  dominio

  Linter y formatter      V0.2                    Consistencia automática

  PostgreSQL y            V0.3                    Persistencia e
  migraciones                                     integridad

  Pruebas de integración  V0.3--V0.4              Verificar colaboración
                                                  entre componentes

  OpenAPI                 V0.4                    Documentar contrato de
                                                  API

  CI                      V0.8                    Verificar cambios
                                                  automáticamente

  Docker                  V0.9                    Entorno reproducible

  Logs y monitoreo        V1.0                    Diagnosticar problemas
                                                  reales

  Backups y restauración  V1.0                    Recuperación ante
                                                  pérdida de datos

  Optimización de         V1.1                    Mejorar a partir de
  consultas                                       mediciones
  -----------------------------------------------------------------------

No aplicar una herramienta solo porque aparece en la tabla. Cada una
debe resolver una necesidad del proyecto.

------------------------------------------------------------------------

## 8. Uso responsable de IA durante el aprendizaje

La IA puede ayudarte a pensar, revisar y acelerar trabajo. Para evitar
que sustituya el aprendizaje, seguir estas reglas:

1.  Antes de pedir código, escribir el comportamiento esperado y los
    casos límite.
2.  Intentar resolver la tarea durante un tiempo razonable.
3.  Si te bloqueas, pedir una pista concreta antes de pedir la solución
    completa.
4.  Si recibes código generado, leerlo, probarlo y explicar cada parte
    importante.
5.  Pedir revisión de seguridad, pruebas y errores posibles; no asumir
    que la respuesta es correcta.
6.  No pegar secretos, credenciales ni datos financieros personales en
    prompts.
7.  Registrar las decisiones técnicas importantes, no transcripciones
    enteras de conversaciones.
8.  Medir el aprendizaje por la capacidad de explicar, modificar y
    depurar la solución, no por la cantidad de líneas escritas.

### Prompt de revisión recomendado

``` text
Actúa como revisor técnico de mi implementación.

Contexto:
[problema y criterios de aceptación]

Mi solución:
[código o diff]

No reescribas todo de inmediato.
1. Identifica errores funcionales y casos límite.
2. Señala riesgos de mantenibilidad y seguridad.
3. Distingue problemas reales de preferencias de estilo.
4. Formula preguntas para comprobar si entiendo el código.
5. Propón el cambio mínimo que mejore la solución.
6. Indica qué pruebas faltan.
```

------------------------------------------------------------------------

## 9. Definición general de Done

Una incidencia solo se considera terminada cuando:

-   Cumple sus criterios de aceptación.
-   El comportamiento principal se ha verificado.
-   Las pruebas relevantes pasan.
-   El código se revisó y no contiene cambios accidentales.
-   No se han añadido secretos ni datos personales.
-   La documentación necesaria está actualizada.
-   El cambio está integrado en `main`.
-   La incidencia de Jira está enlazada y cerrada.

Para tareas de aprendizaje muy pequeñas, aplicar esta definición con
proporcionalidad: no exigir documentación extensa para cada función.

------------------------------------------------------------------------

## 10. Primera sesión: comenzar sin sobreplanificar

La primera meta es completar V0.1 con un núcleo pequeño y funcional.

### Tarea inicial: definir y crear un movimiento financiero

**Resultado:** un tipo de dominio `Transaction` que represente un
ingreso o un gasto, con reglas explícitas.

Pasos:

1.  Crear el repositorio y el README inicial.
2.  Crear el proyecto TypeScript con configuración estricta.
3.  Definir en lenguaje natural qué datos necesita un movimiento.
4.  Decidir cómo representar el tipo de movimiento, el monto, la fecha y
    la categoría.
5.  Escribir pruebas para entradas válidas e inválidas.
6.  Implementar la solución mínima para que las pruebas pasen.
7.  Revisar los casos límite y registrar una decisión si hay una
    elección importante.
8.  Crear un pull request pequeño y completar su checklist.

### Criterios de aceptación de la primera tarea

-   El proyecto puede instalarse siguiendo el README.
-   TypeScript compila con modo estricto.
-   El dominio define de forma explícita qué constituye un movimiento
    válido.
-   Las pruebas cubren al menos un ingreso válido, un gasto válido y
    entradas inválidas.
-   El cambio está en una rama y se integra mediante el flujo acordado.
-   Puedes explicar cada decisión relevante sin depender de la IA.

No es necesario crear una API, una base de datos o una interfaz en la
primera sesión.

------------------------------------------------------------------------

## 11. Checklist de arranque

-   [ ] Crear el repositorio `personal-finance-system`.
-   [ ] Añadir README, `.gitignore` y `.editorconfig`.
-   [ ] Crear el proyecto Jira.
-   [ ] Crear el Epic `V0.1 — Core domain`.
-   [ ] Crear solo las primeras tareas concretas.
-   [ ] Configurar TypeScript estricto y pruebas.
-   [ ] Implementar el primer tipo de dominio.
-   [ ] Abrir el primer pull request.
-   [ ] Registrar el aprendizaje y planear el siguiente incremento.

**Regla final:** no volver a empezar desde cero solo porque descubriste
una práctica mejor. Primero comprende el problema, mejora el código
existente y continúa construyendo. El proyecto debe ser evidencia de tu
evolución, no una sucesión de reinicios.
