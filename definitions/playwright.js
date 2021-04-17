const { chromium } = require('playwright');
const BrowserNotOpenedError = require('../errors/BrowserNotOpenedError.js');
const PageNotOpenedError = require('../errors/PageNotOpenedError.js');
const CantReachUrlError = require('../errors/CantReachUrlError.js');
const TestFailedError = require('../errors/TestFailedError.js');

let browserPromise;
let pagePromise;
let remaining;

function loadBrowser() {
  if (!browserPromise) {
    throw new BrowserNotOpenedError();
  }

  return browserPromise.then(
    (browser) => browser
  );
}

function loadPage() {
  if (!pagePromise) {
    throw new PageNotOpenedError();
  }

  return loadBrowser().then(
    () => pagePromise.then(
      (page) => page
    )
  ).catch(() => { throw new BrowserNotOpenedError(); });
}

function loadElem(elem) {
  return loadPage().then(
    () => elem.then(
      (el) => {
        if (!el) {
          throw new TestFailedError();
        }
        return el;
      }
    )
  );
}

module.exports = {
  CREATE_BROWSER: () => {
    browserPromise = chromium.launch();
  },
  CLOSE_BROWSER: () => {
    loadBrowser().then(
      () => browserPromise.then(
        (browser) => browser.close()
      )
    );
  },
  VISIT: (url) => {
    pagePromise = loadBrowser().then(
      (browser) => browser.newPage().then(
        (page) => page.goto(url).then(
          () => page
        )
      ).catch(() => { throw new CantReachUrlError(); })
    );
    return pagePromise;
  },
  WAIT: (timeout) => {
    if (timeout) {
      return new Promise((resolve) => setTimeout(() => resolve(), timeout));
    }
  },
  WATCH_CONSOLE: (messagesToWatch) => {
    remaining = messagesToWatch;
    return loadPage().then(
      (p) => p.addListener('console', (msg) => {
        if (remaining.includes(msg.text())) {
          remaining.splice(remaining.findIndex((r) => r === msg.text()), 1);
        }
      })
    );
  },
  END_WATCH_CONSOLE: () => {
    return loadPage().then(
      () => {
        if (remaining.length) {
          throw new TestFailedError();
        }
      }
    );
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
    SET_VALUE: (elem, value) => {
      if (typeof elem === 'string') {
        return loadPage().then(
          (p) => p.$eval(elem, (el, value) => el.value = value, value)
        );
      }
      return loadElem(elem).then(
        (el) => el.evaluate(
          (node, value) => node.value = value, value
        )
      );
    }
  },
  DISPATCH: (elem, ev) => {
    return loadElem(elem).then(
      (el) => el.dispatchEvent(ev)
    );
  },
  GET: {
    ONE: (selector) => {
      return loadPage().then(
        (page) => page.$(selector).then(
          (elem) => {
            if (!elem) {
              throw new TestFailedError();
            }
            return elem;
          }
        )
      // ez az aszinkronitás kikerülése miatt kell. nem létező selectornál hibát jelez, hogy a böngésző bezárt a lekérdezés előtt
      ).catch(() => {});
    },
    MANY: (selector) => {
      return loadPage().then(
        (page) => page.$$(selector).then(
          (elems) => {
            if (!elems) {
              throw new TestFailedError();
            }
            return Array.from(elems);
          }
        )
      );
    },
    ATTRIBUTE: (elem, attribute) => {
      if (elem.then) {
        return loadElem(elem).then(
          (el) => el.getProperty(attribute).then(
            (property) => property.jsonValue()
          )
        );
      }

      return elem.getProperty(attribute).then(
        (property) => property.jsonValue()
      );
    }
  },
  ASSERT: {
    EXISTS: (selector) => {
      return loadPage().then(
        (page) => page.$(selector).then(
          (elem) => {
            if (!elem) {
              throw new TestFailedError();
            }

            return !!elem;
          }
        )
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
    },
    FUNCTION_RETURNS: (functionName, ...parameters) => {
      const paramStrings = parameters.map(
        (param) => {
          // ez itt egy kis hack. string-re kell konvertálni a paramétereket, hogy injektálni lehessen
          if (Array.isArray(param) || param && typeof param === 'object') {
            return JSON.stringify(param);
          }
          return param;
        }
      );

      const functionString = `${functionName}(${paramStrings.join(',')})`;
      return loadPage().then(
        (page) => page.evaluate(functionString)
      );
    }
  }
};
