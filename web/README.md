# Front

React y Vite, en este mismo repositorio. En desarrollo habla con la API por el proxy de Vite: el navegador pide `/transactions` en el puerto `5173` y Vite lo reenvía a `http://localhost:3000`.

Desde la raíz del repositorio, con la API ya en marcha:

```bash
pnpm dev:web
```

La pantalla queda en [http://localhost:5173](http://localhost:5173). Muestra el saldo y la lista que devuelve la API. Las vistas de Stitch reemplazan esta pantalla cuando se incorporen.
