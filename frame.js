const Definitions = require('./definitions/playwright.js');
const TestFailedError = require('./errors/TestFailedError.js');

const failTestIfShould = (result) => {
  if (!result) {
    throw new TestFailedError();
  }
};

/**
 * Létrehoz egy új böngésző instance-ot.
 * NEM kell megvárni!
*/
function CREATE_BROWSER() {
  Definitions.CREATE_BROWSER();
}

/**
 * Bezárja a létrehozott instance-ot.
 * NEM kell megvárni!
 */
function CLOSE_BROWSER() {
  Definitions.CLOSE_BROWSER();
}

/**
 * Meglátogatja a POST body-ban kapott url-t
 * @param {string} url - A meglátogatandó url
 */
async function VISIT(url) {
  return Definitions.VISIT(url);
}

/**
 * A megadott időre lefagyasztja a tesztelést
 * @param {number} timeout - ms-ben megadott megvárandó idő
 * @returns {Promise} - megvárandó várakozás
 */
function WAIT(timeout) {
  return Definitions.WAIT(timeout);
}

/**
 * Feliratkozik a console-ba történő írás eseményekre, és a kapott üzenet tömb-ből kiszedegeti az eddig console-ra írt üzeneteket.
 * A teszt sikeres, ha a tömb az END_WATCH_CONSOLE hívás során üres.
 * @param  {string[]} messagesToWatch - Egy tömbnyi üzenet, aminek a jelenlétét figyeli.
 * @returns {Promise}
 */
function WATCH_CONSOLE(messagesToWatch) {
  return Definitions.WATCH_CONSOLE(messagesToWatch);
}

/**
 * Eldönti, hogy sikeres volt-e a WATCH_CONSOLE teszt.
 * @throws TestFailedError
 * @returns {Promise}
 */
function END_WATCH_CONSOLE() {
  return Definitions.END_WATCH_CONSOLE();
}

const INPUT = {
  /**
   * Egy legördülő listából kiválasztja a megadott opciót
   * @param {Element} elem - A select tag
   * @param {string} value - A kiválasztandó option tag
   * @returns {Promise} - megvárandó kiválasztás
   */
  SELECT: Definitions.INPUT.SELECT,
  /**
   * Egy vagy több megadott checkbox közül kiválasztja az adott `value` értékűt.
   * Megjelölés és jelölés elvételére is alkalmas.
   * @param {Element[]|Element} elems - A checkbox(ok)
   * @param {string} value - A checkboxok közül a kiválasztandó `value`-ja
   * @returns {Promise} - megvárandó kiválasztás
   */
  CHECK: Definitions.INPUT.CHECK,
  /**
   * A megadott input tag-be beleírja a szintén megadott értéket
   * A SET_VALUE generikusabb! Ez csak text inputra működik!
   * @param {Element} elem - Az input tag
   * @param {string} value - A beírandó érték
   * @returns {Promise} - megvárandó beírás
   */
  WRITE: Definitions.INPUT.WRITE,

  /**
   * Egy sokkal generikusabb WRITE, ami minden `value` attribútummal rendelkező tag-re működik.
   * @param {string|Element} elem - Az elem, aminek az `value` attribútumát szeretnénk beállítani, vagy a selector, ami ezt az elemet jelöli.
   * @param {any} value - az érték, amire be szeretnénk állítani
   * @returns {Promise} - megvárandó beírás
   */
  SET_VALUE: Definitions.INPUT.SET_VALUE
};

const GET = {
  /**
   * Visszaad egy html elemet
   * @param {string} selector - A selector, ami alapján kiválasztja az elemet
   * @returns {Promise} - megvárandó elem
   */
  ONE: Definitions.GET.ONE,
  /**
   * Visszaad több html elemet
   * @param {string} selector - A selector, ami alapján kiválasztja az elemeket
   * @returns {Promise} - megvárandó elemek
   */
  MANY: Definitions.GET.MANY,
  /**
   * Visszaadja egy elem adott attribútumát
   * @param {Element} elem - Az elem, amin az attribútumot keressük
   * @param {string} attribute - Az attribútum neve
   * @returns {Promise} - megvárandó attribútum
   */
  ATTRIBUTE: Definitions.GET.ATTRIBUTE,
};

/**
 * Egy megadott element végrehajtja az adott eseményt.
 * @param {Element} elem - Az elem, amin az esemény meg lesz hívva
 * @param {string} ev - Az esemény neve
 * @returns Az esemény promise
 */
function DISPATCH(elem, ev) {
  return Definitions.DISPATCH(elem, ev);
}

const ASSERT = {
  /**
   * Eldönti két elemről, hogy egyenlőek-e.
   * Ezek lehetnek korábban GET-elt elemek, vagy más, primitív változók is
   * @param {any} elem1
   * @param {any} elem2
   * @throws TestFailedError
   * @returns {boolean}
   */
  EQUALS: (elem1, elem2) => {
    console.log('👀 Ellenőrzés hogy a két érték EGYENLŐ-e');
    let result;
    if (Array.isArray(elem1)) {
      if (Array.isArray(elem2)) {
        result = elem2.every((item) => elem1.includes(item));
      } else {
        result = elem1.every((item) => item === elem2);
      }
    } else if (Array.isArray(elem2)) {
      result = elem2.every((item) => item === elem1);
    } else if (typeof elem1 === 'object' && typeof elem2 === 'object') {
      result = Object.keys(elem1).every(
        (item) => Object.keys(elem2).includes(item) && elem1[item] === elem2[item]
      );
    }

    result = result || elem1 === elem2;

    failTestIfShould(result);
    return result;
  },
  /**
   * Eldönti a megadott értékről, hogy igaz-e
   * Ez lehet bármi, amiből lehet truthy értéket csinálni
   * @param {any} item - az érték, aminek igazságát el kell dönteni
   * @throws TestFailedError
   * @returns {boolean}
   */
  TRUE: (item) => {
    console.log('👀 Ellenőrzés, hogy az érték IGAZ-e');
    const result = !!item;

    failTestIfShould(result);
    return result;
  },
  /**
   * Eldönti a megadott értékről, hogy hamis-e
   * Ez lehet bármi, amiből lehet falsey értéket csinálni
   * @param {any} item - az érték, aminek hamisságát el kell dönteni
   * @throws TestFailedError
   * @returns {boolean}
   */
  FALSE: (item) => {
    console.log('👀 Ellenőrzés, hogy az érték HAMIS-e');
    const result = !item;
    failTestIfShould(!result);
    return !item;
  },
  /**
   * Eldönti a megadott értékről, hogy létezik-e
   * String esetén html selector-ként értelmeződik és az Element létezését dönti el
   * @param {Element|Array|Object|string} item - az érték, aminek létezését el kell dönteni
   * @throws TestFailedError
   * @returns {boolean}
   */
  EXISTS: async (item) => {
    console.log('👀 Ellenőrzés, hogy az érték LÉTEZIK-e');
    let result;

    if (Array.isArray(item)) {
      result = !!item.length;
    }
    if (typeof item === 'object') {
      result = !!Object.keys(item).length;
    }
    if (typeof item === 'string') {
      result = await Definitions.ASSERT.EXISTS(item);
    }

    failTestIfShould(result);
    return result;
  },
  /**
   * Eldönti, hogy az adott elemnek létezik-e az adott attribútuma
   * @param {Element} elem - Az elem, amin keresni kell az attribútumot
   * @param {string} attr - A keresendő attrbútum
   * @throws TestFailedError
   * @returns {boolean}
   */
  HAS_ATTRIBUTE: async (elem, attr) => {
    console.log('👀 Ellenőrzés, hogy az érték attribútuma LÉTEZIK-e');
    const result = await Definitions.ASSERT.HAS_ATTRIBUTE(elem, attr);

    failTestIfShould(result);
    return result;
  },
  /**
   * Eldönti, hogy az adott elemen lévő attribútum egyenlő-e az értékkel
   * @param {Element} elem - Az elem, amin van az attribútum
   * @param {string} attr - A vizsgálandó attribútum
   * @param {string} value - Az érték
   * @throws TestFailedError
   * @returns {boolean}
   */
  ATTRIBUTE_EQUALS: async (elem, attr, value) => {
    console.log(`👀 Ellenőrzés, hogy az érték attribútuma EGYENLŐ-e ${value}-val`);
    const result =  await Definitions.ASSERT.ATTRIBUTE_EQUALS(elem, attr, value);

    failTestIfShould(result);
    return result;
  },
  /**
   * Eldönti, hogy az adott kifejezés dobott-e hibát
   * @param {any} expression - A kifejezés, ami dobhat hibát
   * @throws TestFailedError
   * @returns {boolean}
   */
  THROWS: (expression) => {
    if (!expression) {
      return false;
    }

    return Promise.resolve(expression).then(
      () => {
        return false;
      }
    ).catch(
      () => {
        failTestIfShould(true);
        return true;
      }
    );
  },
  /**
   * A megadott függvényt megkeresi név alapján, és a paraméterekkel végrehajtja, majd ellenőrzi, hogy egyenlő-e a megadott eredménnyel.
   * @param {any} result - a függvény eredménye, amivel egyenlőnek kell lennie
   * @param {string} functionName - a függvény neve
   * @param {...any} parameters - a függvény paraméterei
   */
  FUNCTION_RETURNS: async (result, functionName, ...parameters) => {
    console.log(`👀 Ellenőrzés, hogy a ${functionName}(${parameters}) EGYENLŐ-e ${result}-val`);
    const functionResult = await Definitions.ASSERT.FUNCTION_RETURNS(functionName, ...parameters);
    return ASSERT.EQUALS(result, functionResult);
  }
};

module.exports = {
  CREATE_BROWSER,
  CLOSE_BROWSER,
  VISIT,
  WAIT,
  WATCH_CONSOLE,
  END_WATCH_CONSOLE,
  INPUT,
  GET,
  DISPATCH,
  ASSERT,
};
