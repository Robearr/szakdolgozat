# TL;DR

## Config

### server
Létre kell hozni egy **.env** file-t, a **.env.EXAMPLE** alapján.

**.env** tartalma:
- `JWT_SECRET`: bármilyen string. A JWT-hez szükséges titok.
- `TEST_CLIENT_URL`: url string. A tesztek futtatásához szükséges kliens url-je.

### client
Létre kell hozni egy **.env** file-t, a **.env.EXAMPLE** alapján.

**.env** tartalma:
- `REACT_APP_API_BASE_URL`: bármilyen string. A szerver base url-je. Például: `http://localhost:5000`
- `REACT_APP_HASH_ALGORITHM`: bármilyen string. Jelszavak hasheléséhez használt algoritmus. Például: `md5, sha256, ...`

## Futtatás

### server
A  **server** mappából ki kell adni a következő parancsot: `node ./src/server.js`

Tesztek indításához szintén a **server** mappából kell kiadni, ezt a parancsot: `npm run test`

Ha nincs beállítva a **.env** file-ban port, akkor alapértelmezetten az **5000**-es porton indul el.

### client
A **client/frame** mappából ki kell adni a következő parancsot: `npm start`

Ha nincs beállítva a **.env** file-ban port, akkor alapértelmezetten az **3000**-es porton indul el.