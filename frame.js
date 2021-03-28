// TODO: jól kellene dokumentálni
import chalk from 'chalk';
import Definitions from './definitions/playwright.js';

const getResultMessage = (result, message) => {
  return console.log(result ?
    `✔ ${chalk.green(message)}` :
    `❌ ${chalk.red(message)}`);
};

export function CREATE_BROWSER() {
  Definitions.CREATE_BROWSER();
}

export function CLOSE_BROWSER() {
  Definitions.CLOSE_BROWSER();
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

    getResultMessage(result, `A két érték ${!result ? 'NEM' : ''} egyenlő!`);
    return result;
  },
  TRUE: (item) => {
    console.log('👀 Ellenőrzés, hogy az érték IGAZ-e');
    const result = !!item;

    getResultMessage(result, `Az érték ${result ? '' : 'NEM'} IGAZ`);
    return result;
  },
  FALSE: (item) => {
    console.log('👀 Ellenőrzés, hogy az érték HAMIS-e');
    const result = !item;
    getResultMessage(!result, `Az érték ${result ? 'NEM' : ''} HAMIS`);
    return !item;
  },
  EXISTS: (item) => {
    console.log('👀 Ellenőrzés, hogy az érték LÉTEZIK-e');
    let result;

    if (Array.isArray(item)) {
      result = !!item.length;
    }
    if (typeof item === 'object') {
      result = !!Object.keys(item).length;
    }
    if (typeof item === 'string') {
      result = Definitions.ASSERT.EXISTS(item);
    }
    getResultMessage(result, `Az érték ${result ? '' : 'NEM'} LÉTEZIK`);
    return result;
  },
  HAS_ATTRIBUTE: (elem, attr) => {
    console.log('👀 Ellenőrzés, hogy az érték attribútuma LÉTEZIK-e');
    const result = Definitions.ASSERT.HAS_ATTRIBUTE(elem, attr);

    getResultMessage(result, `Az érték attribútuma ${result ? '' : 'NEM'} LÉTEZIK`);
    return result;
  },
  ATTRIBUTE_EQUALS: (elem, attr, value) => {
    console.log(`👀 Ellenőrzés, hogy az érték attribútuma EGYENLŐ-e ${value}-val`);
    const result =  Definitions.ASSERT.ATTRIBUTE_EQUALS(elem, attr, value);

    getResultMessage(result, `Az érték ${result ? '' : 'NEM'} EGYENLŐ ${value}-val`);
    return result;
  },
};
