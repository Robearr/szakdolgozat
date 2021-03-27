import { chromium } from 'playwright';
import BrowserNotOpenedError from '../errors/BrowserNotOpenedError.js';
import CantReachUrlError from '../errors/CantReachUrlError.js';
import ElementNotFoundError from '../errors/ElementNotFoundError.js';

let browserPromise;
let pagePromise;

function loadBrowser() {
  return browserPromise.then(
    (browser) => browser
  );
}

function loadPage() {
  return loadBrowser().then(
    () => pagePromise.then(
      (page) => page
    )
  ).catch(() => { throw new BrowserNotOpenedError(); });
}

function loadElem(elem) {
  return loadPage().then(
    () => elem.then(
      (el) => el
    ).catch(() => { throw new ElementNotFoundError(); })
  );
}

export default {
  CREATE_BROWSER: () => {
    browserPromise = chromium.launch();
  },
  VISIT: (url) => {
    pagePromise = loadBrowser().then(
      (browser) => browser.newPage().then(
        (page) => page.goto(url).then(
          () => page
        ).catch(() => { throw new CantReachUrlError(); })
      )
    );
  },
  WAIT: (timeout) => {
    if (timeout) {
      return new Promise((resolve) => setTimeout(() => resolve(), timeout));
    }
  },
  INPUT: {
    SELECT: (elem, value) => {
      return loadElem(elem).then(
        (el) => el.selectOption({ value })
      );
    },
    CHECK: (elems, value) => {
      return loadElem(elems).then(
        async (els) => {
          if (!Array.isArray(els)) {
            return await els.isChecked() ? els.uncheck() : els.check();
          }
          els.forEach(
            async (elem) => {
              if (await (await elem.getProperty('value')).jsonValue() === value) {
                return await elem.isChecked() ? elem.uncheck() : elem.check();
              }
            }
          );
        }
      );
    },
    WRITE: (elem, value) => {
      return loadElem(elem).then(
        (el) => el.fill(value)
      );
    },
  },
  DISPATCH: (elem, ev) => {
    return loadElem(elem).then(
      (el) => el.dispatchEvent(ev)
    );
  },
  GET: {
    ONE: (selector) => {
      return loadPage().then(
        (page) => page.$(selector)
      ).catch(() => { throw new ElementNotFoundError(); });
    },
    MANY: (selector) => {
      return loadPage().then(
        (page) => page.$$(selector)
      ).catch(() => { throw new ElementNotFoundError(); });
    },
    ATTRIBUTE: (elem, attribute) => {
      return loadElem(elem).then(
        (el) => el.getProperty(attribute).then(
          (property) => property.jsonValue()
        )
      );
    }
  },
  ASSERT: {
    EQUALS: () => {},
    TRUE: () => {},
    FALSE: () => {},
    EXISTS: (selector) => {
      return loadPage().then(
        (page) => page.$(selector).then(
          (elem) => !!elem
        ).catch(() => { throw new ElementNotFoundError(); })
      );
    },
    HAS_ATTRIBUTE: (elem, attr) => {
      return loadElem(elem).then(
        (el) => el.getAttribute(attr).then(
          (attribute) => !!attribute
        )
      );
    },
    ATTRIBUTE_EQUALS: (elem, attr, value) => {
      return loadElem(elem).then(
        (el) => el.getAttribute(attr).then(
          (attribute) => attribute === value
        )
      );
    }
  }
};
