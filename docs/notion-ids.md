# IDs de Notion

Usa estos IDs en Atajos, en `POST /v1/pages` y al reconectar la integración. No incluyen el token.

Hub: [Finanzas](https://app.notion.com/p/3cff454b5630814690fec87bfbd8b82a) — `3cff454b-5630-8146-90fe-c87bfbd8b82a`

## Bases

| Nombre | database_id | data_source (collection) | URL |
| --- | --- | --- | --- |
| Cuentas | `a9909977-1ecb-4c6b-897d-a26f0e25dfe4` | `206bc86a-35d8-46c5-877d-833600dbbc67` | [abrir](https://app.notion.com/p/a99099771ecb4c6b897da26f0e25dfe4) |
| Categorías | `093b4198-a6a3-41a2-9dbc-fe06c6c90762` | `5da66eda-98c1-4733-8c71-9951a1c9e59c` | [abrir](https://app.notion.com/p/093b4198a6a341a29dbcfe06c6c90762) |
| Movimientos | `c1642803-7482-48ac-ba24-5c31686ff821` | `cb047c7a-6add-437a-a72e-e40d88d6bffc` | [abrir](https://app.notion.com/p/c1642803748248acba245c31686ff821) |
| Presupuestos | `4d457302-d474-44d2-8361-42c0ac25da98` | `d31d4836-299e-4352-b439-39e7591a60b8` | [abrir](https://app.notion.com/p/4d457302d47444d2836142c0ac25da98) |

La API clásica usa `database_id` en `parent`. Las relaciones usan `page_id` de la fila.

## Cuentas (page_id)

| Nombre | page_id |
| --- | --- |
| Efectivo | `3cff454b-5630-8188-9c8b-df74ffc31235` |
| Nequi | `3cff454b-5630-812c-aee9-f2aa97341659` |
| Bancolombia | `3cff454b-5630-81f3-887c-e59cfc38b8ea` |
| Daviplata | `3cff454b-5630-81b1-9c7a-eb28129e2ce0` |
| Tarjeta crédito | `3cff454b-5630-8138-8987-d52aff5b75ad` |

## Categorías de gasto

| Nombre | page_id |
| --- | --- |
| Alimentación | `3cff454b-5630-81e3-9ab4-d5c5aaa68b06` |
| Transporte | `3cff454b-5630-81d8-aab8-f66e0426d6f5` |
| Hogar | `3cff454b-5630-8110-8616-dacffa81cd01` |
| Tecnología | `3cff454b-5630-8153-bd41-dc4cc1736658` |
| Educación | `3cff454b-5630-81f1-a7dd-c6b888961ba3` |
| Deporte | `3cff454b-5630-81db-96ac-dd7a65cc7cac` |
| Ropa | `3cff454b-5630-8182-895d-e5e19800f8d2` |
| Entretenimiento | `3cff454b-5630-8182-b073-ee4d1cabb471` |
| Suscripciones | `3cff454b-5630-81a7-bc95-f616b0bb1300` |
| Otros | `3cff454b-5630-812d-b018-d96af021dc0a` |

## Categorías de ingreso

| Nombre | page_id |
| --- | --- |
| Salario | `3cff454b-5630-8183-a6e9-e982c5150da4` |
| Freelance | `3cff454b-5630-813a-b6a9-ce49e37643b9` |
| Otros ingresos | `3cff454b-5630-811f-83d7-c765a4e495e3` |

## Páginas de guía

| Página | page_id |
| --- | --- |
| Captura iPhone | `3cff454b-5630-8180-8d12-d092cc269f01` |
| Modelo de datos | `3cff454b-5630-815a-91c3-d34733d12a79` |
| Roadmap | `3cff454b-5630-810e-bb0d-eb82723e8de2` |
| IDs para API | `3cff454b-5630-817e-907c-c625ccff93ef` |

Si recreas una fila (por ejemplo una cuenta nueva), actualiza este archivo y la página Notion homónima.
