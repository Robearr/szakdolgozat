// TODO: jól kellene dokumentálni
// TODO: Az emojik nem jók
// TODO: szebb üzenetek
import Definitions from './definitions/playwright.js';

const SUCCESS_MESSAGE_STYLE = 'color:green;';
const ERROR_MESSAGE_STYLE = 'color:red;';

const getResultMessageType = (result) => {
  return result ? SUCCESS_MESSAGE_STYLE : ERROR_MESSAGE_STYLE;
};

export function CREATE_BROWSER() {
  Definitions.CREATE_BROWSER();
}

export function VISIT(url) {
  Definitions.VISIT(url);
}

export function WAIT(timeout) {
  return Definitions.WAIT(timeout);
}

export const INPUT = {
  SELECT: Definitions.INPUT.SELECT,
  CHECK: Definitions.INPUT.CHECK,
  WRITE: Definitions.INPUT.WRITE
};

export const GET = {
  ONE: Definitions.GET.ONE,
  MANY: Definitions.GET.MANY,
  ATTRIBUTE: Definitions.GET.ATTRIBUTE,
};

export function DISPATCH(elem, ev) {
  return Definitions.DISPATCH(elem, ev);
}

export const ASSERT = {
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

    console.log(`A két érték ${!result ? 'NEM' : ''} egyenlő!`, getResultMessageType(result));
    return result;
  },
  TRUE: (item) => {
    console.log('👀 Ellenőrzés, hogy az érték IGAZ-e');
    const result = !!item;
    console.log(`Az érték ${result ? '' : 'NEM'} IGAZ`, getResultMessageType(result));
    return result;
  },
  FALSE: (item) => {
    console.log('👀 Ellenőrzés, hogy az érték HAMIS-e');
    const result = !item;
    console.log(`Az érték ${result ? 'NEM' : ''} HAMIS`, getResultMessageType(!result));
    return !item;
  },
  EXISTS: (item) => {
    console.log('👀 Ellenőrzés, hogy az érték LÉTEZIK-e');
    if (Array.isArray(item)) {
      return !!item.length;
    }
    if (typeof item === 'object') {
      return !!Object.keys(item).length;
    }
    if (typeof item === 'string') {
      return Definitions.ASSERT.EXISTS(item);
    }
  },
  HAS_ATTRIBUTE: (elem, attr) => {
    console.log('👀 Ellenőrzés, hogy az érték attribútuma LÉTEZIK-e');
    return Definitions.ASSERT.HAS_ATTRIBUTE(elem, attr);
  },
  ATTRIBUTE_EQUALS: (elem, attr, value) => {
    console.log(`👀 Ellenőrzés, hogy az érték attribútuma EGYENLŐ-e ${value}-val`);
    return Definitions.ASSERT.ATTRIBUTE_EQUALS(elem, attr, value);
  },
};
