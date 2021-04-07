# Szerver
Ez a webalkalmazás Node.js segítségével készült. Az entry pointja a `server.js`, amit a következő parancsokkal lehet elindítani:
  - `node server.js`
  - `nodemon server.js` (ez csak fejlesztéshez ajánlott)
Elindulás után a **.env** fileban megadott, vagy ha az hiányzik, akkor a **3000**-es porton válik elérhetővé az alkalmazás.

Indítás előtt kötelező az `npm install` parancsot és érdemes az `npm run init-db` parancsot futtatni.
 Az előbbi telepíti a szükséges modulokat, amik nélkül nem működik az alkalmazás, az utóbbi pedig el fogja készíteni az adatbázishoz szükséges táblákat, a hozzá tartozó oszlopokkal és a megfelelő validációkkal. Ezt követően feltölti mindet **dummy adatokkal**.
Ha az adatfeltöltést _(seedelés)_ elhagyható, viszont a táblák létrehozásához _(migráció)_ szükséges lesz futtatni a következő parancsot: `npx sequelize-cli db:migrate`.

**Vigyázat!**

Seedelés nélkül felhasználók sem fognak generálódni, így némelyik végpont elérhetetlenné válik!

# Definició
Az alkalmazás egyik jelentős része, a definíciók változtathasága. Maga a webalkalmazás egy keret, amin keresztül lehetséges teszteket futtatni. Maga a tesztelő még csak `playwright`-ban van megírva a `definitions/playwright.js`-ben, de bármilyen **headless browsert** lehetséges definiálni.

Új definíció létrehozásakor a `frame.js`-ben deklarált függvényeket kell felüldefiniálni. Ezeket érdemes generikusan megírni, és a **headless browser hibáit helyben dobni**, a `definitions/playwright.js`-ben található módon. Az itt dobott saját hibák elkapódnak.

Mivel nem látom hasznát a futás közbeni headless browser váltásnak, ezért az egyetlen opció a cserére a `frame.js` file tetején lévő import lecserélése.

# Runner
A tesztek kiértékeléséhez a `runners/Test.js` file van használva.

Itt történik az adott teszt:
- timeout ellenőrzése
- konzolra való logolása
- pontszám visszaadása

A `runner.js` hívja meg az összes szükséges TestRunner-t, illetve ha voltak a csomagnak hookok megadva, azok is itt hívódnak meg.

Ez a runner file a fő pontja a tesztek kiértékeléséhez.

# Hookok
Jelenleg 4 hook érhető el:
- beforeTest:
  - Minden egyes teszt előtt fut le
- afterTest:
  - Minden egyes teszt után fut le
- beforePackage:
  - Minden egyes csomag előtt fut le
- afterPackage:
  - Minden egyes csomag után fut le

Ezen típusok közül lehet választani létrehozásnál (vagy akár tetszés szerint bővíthető is), illetve egy `callbackPath` oszlopot is ki kell tölteni, hogy megfelelően működjön. Típus alapján a megadott időben fogja a `callbackPath` oszlopban eltárolt név alapján megkeresni a filet, és lefuttatni a benne lévő függvényt.

_Erre is van példa a **hooks** táblában és **hooks/** mappában._

# Tesztek
A tesztek a hookokhoz hasonlóan működnek.

Az adatbázisban van eltárolva minden teszthez a hozzá tartozó `callbackPath`, és az alapján keresi meg, majd futtatja a fileban lévő függvényt.

**FONTOS!**
Bár az IntelliSense segíthet, azért érdemes megjegyezni a következőt, a kerettel kapcsolatban:
- nem kell a böngészőt megnyitni/bezárni, mert ez automatikusan megtörténik **minden** runner hívásnál.
- az url meglátogatása végponttal működik
- elég csak a műveleteket megvárni. viszont azokat szükséges is!
  - nem kell megvárni _(`await`)_: `GET`
  - meg **KELL** várni: `INPUT`, `DISPATCH`, ...
  - szóval lényegében a "műveletek" itt azt akarja jelenteni, hogy olyan cselekedetek, aminek hatása is van.

_Erre is van példa a **tests** táblában és **tests/** mappában._

# API

Összességében mindegyik végpontról elmondható, hogy ha valami hiba történt, akkor valami ilyesmi válasszal tér vissza:
```json
  {
    "severity": "ERROR",
    "messages": ["Valami nem volt jó!"]
  }
```

## Authentikáció

- `POST /auth/login`

  A belépéshez szükséges végpont. Leellenőrzi a megadott adatokat, és amennyiben helyesek, illetve létezik a felhasználó, akkor a hozzá tartozó **JWT tokent** adja vissza, ami **30 percig érvényes**.

  Példa kérés:
  ```json
  {
    "name": "name",
    "password": "password"
  }
  ```

## Tesztcsomagok
- `GET /`

  Az összes tesztcsomag lekérdezésére szolgáló végpont.
- `GET /{id}`

  Egy adott id-jú tesztcsomag lekérdezésére szolgáló végpont.
- `GET /{id}/tests`

  Egy adott id-jú tesztcsomaghoz tartozó tesztek lekérdezésére szolgáló végpont.
- `GET /{id}/tests/{testId}`

  Egy adott id-jú (`id`) tesztcsomaghoz tartozó, adott id-jú (`testId`) teszt lekérdezésére szolgáló végpont.
- `POST /`

  Tesztcsomag létrehozására szolgáló végpont.

  Authentikáció szükséges: `Authorization: Bearer {JWT}`

  Csak oktató számára elérhető!

  Példa kérés:
  ```json
  {
    "name": "Név",
    "description": "Leírás",
    "isActive": true,
    "availableFrom": 2021-01-01,
    "availableTo": 2021-12-12,
    "needsAuth": true,
    "ipMask": "valami regex",
    "urlMask": "valamibb regex",
    "timeout": 20000
  }
  ```
- `POST /{id}/run`

  Egy adott id-jú tesztcsomag lefuttatására szánt végpont.

  Példa kérés:
  ```json
  {
    "url": "localhost:5000"
  }
  ```

  A kérésben opcionálisan megadható a `tests` tömb is. Ha ez szerepel a kérésben, akkor csak az ebben felsorolt tesztek fognak lefutni.

  Példa kérés:
  ```json
  {
    "url": "localhost:5000",
    "tests": [1, 2, 3]
  }
  ```

- `PUT /`

  Tesztcsomag módosítására szolgáló végpont.

  Authentikáció szükséges: `Authorization: Bearer {JWT}`

  Csak oktató számára elérhető!

  Példa kérés:
  ```json
  {
    "id": 8,
    "name": "Név2",
    "isActive": false,
    "needsAuth": false,
  }
  ```
- `DELETE /`

  Tesztcsomag törlésére szolgáló végpont.

  Authentikáció szükséges: `Authorization: Bearer {JWT}`

  Csak oktató számára elérhető!

  Példa kérés:
  ```json
  {
    "id": 8,
  }
  ```

## Tesztek
- `GET /`

  Az összes teszt lekérdezésére szolgáló végpont.
- `GET /{id}`

  Az adott id-jú teszt lekérdezésére szolgáló végpont.
- `POST /`

  Tesztcsomag létrehozására szolgáló végpont.

  Authentikáció szükséges: `Authorization: Bearer {JWT}`

  Csak oktató számára elérhető!

  Példa kérés:
  ```json
  {
    "name": "Teszt név",
    "timeout": 5000,
    "customErrorMessage": "Ez itt sajnos nem jó :c",
    "isCustomErrorMessageVisible": true,
    "isErrorDescriptionVisible": true,
    "isStackVisible": false,
    "points": 3,
    "callbackPath": "tests/theTest.js",
    "packageId": 1
  }
  ```
- `POST /{id}/run`

  Egy adott id-jú teszt lefuttatására szánt végpont.

  Példa kérés:
  ```json
  {
    "url": "localhost:5000"
  }
  ```
- `PUT /`

  Tesztcsomag módosítására szolgáló végpont.

  Authentikáció szükséges: `Authorization: Bearer {JWT}`

  Csak oktató számára elérhető!

  Példa kérés:
  ```json
  {
    "name": "Ez az új teszt név",
    "isCustomErrorMessageVisible": false,
    "isStackVisible": true,
  }
  ```
- `DELETE /`

  Teszt törlésére szolgáló végpont.

  Authentikáció szükséges: `Authorization: Bearer {JWT}`

  Csak oktató számára elérhető!

  Példa kérés:
  ```json
  {
    "id": 8,
  }
  ```
## Statisztikák

Egy statisztika csak akkor kerül elmentésre, ha nincsen belépve felhasználó, vagy ha be van lépve, és jobb eredményt ért el, mint a korábban elmentett (a semminél csak jobb van).

- `GET /`

  Az összes statisztika lekérdezésére szolgáló végpont.

- `GET /packages/{packageId}`

  Az adott packageId-hoz tartozó statisztikák lekérdezésére szolgáló végpont.

- `GET /users/{userId}`

  Az adott userId-hoz tartozó statisztikák lekérdezésére szolgáló végpont.