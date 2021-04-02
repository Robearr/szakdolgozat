// TODO: jól kellene dokumentálni
const Definitions = require('./definitions/playwright.js');
const TestFailedError = require('./errors/TestFailedError.js');

const failTestIfShould = (result) => {
  if (!result) {
    throw new TestFailedError();
  }
};

function CREATE_BROWSER() {
  Definitions.CREATE_BROWSER();
}

function CLOSE_BROWSER() {
  Definitions.CLOSE_BROWSER();
}

async function VISIT(url) {
  return Definitions.VISIT(url);
}

function WAIT(timeout) {
  return Definitions.WAIT(timeout);
}

const INPUT = {
  SELECT: Definitions.INPUT.SELECT,
  CHECK: Definitions.INPUT.CHECK,
  WRITE: Definitions.INPUT.WRITE
};

const GET = {
  ONE: Definitions.GET.ONE,
  MANY: Definitions.GET.MANY,
  ATTRIBUTE: Definitions.GET.ATTRIBUTE,
};

function DISPATCH(elem, ev) {
  return Definitions.DISPATCH(elem, ev);
}

const ASSERT = {
  EQUALS: (elem1, elem2) => {
    console.log('👀 Ellenőrzés hogy a két érték EGYENLŐ-e');
    let result;
    if (Array.isArray(elem1)) {
      if (Array.isArray(elem2)) {
        result = elem2.every((item) => elem1.includes(item));
      }
    } else if (typeof elem1 === 'object') {
      if (typeof elem2 === 'object') {
        result = Object.keys(elem1).every(
          (item) => Object.keys(elem2).includes(item) && elem1[item] === elem2[item]
        );
      }

    }
    result = result || elem1 === elem2;

    failTestIfShould(result);
    return result;
  },
  TRUE: (item) => {
    console.log('👀 Ellenőrzés, hogy az érték IGAZ-e');
    const result = !!item;

    failTestIfShould(result);
    return result;
  },
  FALSE: (item) => {
    console.log('👀 Ellenőrzés, hogy az érték HAMIS-e');
    const result = !item;
    failTestIfShould(!result);
    return !item;
  },
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
  HAS_ATTRIBUTE: async (elem, attr) => {
    console.log('👀 Ellenőrzés, hogy az érték attribútuma LÉTEZIK-e');
    const result = await Definitions.ASSERT.HAS_ATTRIBUTE(elem, attr);

    failTestIfShould(result);
    return result;
  },
  ATTRIBUTE_EQUALS: async (elem, attr, value) => {
    console.log(`👀 Ellenőrzés, hogy az érték attribútuma EGYENLŐ-e ${value}-val`);
    const result =  await Definitions.ASSERT.ATTRIBUTE_EQUALS(elem, attr, value);

    failTestIfShould(result);
    return result;
  },
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
};

module.exports = {
  CREATE_BROWSER,
  CLOSE_BROWSER,
  VISIT,
  WAIT,
  INPUT,
  GET,
  DISPATCH,
  ASSERT,
};
