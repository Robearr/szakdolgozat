import { chromium } from 'playwright';
import BrowserNotOpenedError from '../errors/BrowserNotOpenedError';
import CantReachUrlError from '../errors/CantReachUrlError';
import ElementNotFoundError from '../errors/ElementNotFoundError';

let browserPromise;
let pagePromise;

function loadBrowser() {
  return browserPromise.then(
    (browser) => browser
  ).catch(
    () => { throw new BrowserNotOpenedError(); }
  );
}

function loadPage() {
  return loadBrowser().then(
    () => pagePromise.then(
      (page) => page
    )
  ).catch(() => { throw new ElementNotFoundError(); });
}

export default {
  CREATE_BROWSER: () => {
    browserPromise = chromium.launch(/*{ headless: false }*/);
  },
  VISIT: (url) => {
    pagePromise = browserPromise.then(
      (browser) => browser.newPage().then(
        (page) => page.goto(url).then(
          () => page
        ).catch(() => { throw new CantReachUrlError(); })
      )
    ).catch(() => { throw new BrowserNotOpenedError(); });
  },
  WAIT: (timeout) => {
    if (timeout) {
      return new Promise((resolve) => setTimeout(() => resolve(), timeout));
    }
  },
  INPUT: {
    SELECT: (elem, value) => {
      return elem.then(
        (el) => el.selectOption({ value })
      ).catch(() => { throw new ElementNotFoundError(); });
    },
    CHECK: (elems, value) => {
      return elems.then(
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
      ).catch(() => { throw new ElementNotFoundError(); });
    },
    WRITE: (elem, value) => {
      return elem.then(
        (el) => el.fill(value)
      ).catch(() => { throw new ElementNotFoundError(); });
    },
  },
  DISPATCH: (elem, ev) => {
    return elem.then(
      (el) => el.dispatchEvent(ev)
    ).catch(() => { throw new ElementNotFoundError(); });
  },
  GET: {
    ONE: (selector) => {
      return browserPromise.then(
        () => pagePromise.then(
          (page) => page.$(selector)
        ).catch(() => { throw new ElementNotFoundError(); })
      ).catch(() => { throw new BrowserNotOpenedError(); });
    },
    MANY: (selector) => {
      return browserPromise.then(
        () => pagePromise.then(
          (page) => page.$$(selector)
        ).catch(() => { throw new ElementNotFoundError(); })
      ).catch(() => { throw new BrowserNotOpenedError(); });
    },
    ATTRIBUTE: (elem, attribute) => {
      return elem.then(
        (el) => el.getProperty(attribute).then(
          (property) => property.jsonValue()
        )
      ).catch(() => { throw new ElementNotFoundError(); });
    }
  },
  ASSERT: {
    EQUALS: () => {},
    TRUE: () => {},
    FALSE: () => {},
    EXISTS: (selector) => {
      return browserPromise.then(
        () => pagePromise.then(
          (page) => page.$(selector).then(
            (elem) => !!elem
          ).catch(() => { throw new ElementNotFoundError(); })
        )
      ).catch(() => { throw new BrowserNotOpenedError(); });
    },
    HAS_ATTRIBUTE: (elem, attr) => {
      return elem.then(
        (el) => el.getAttribute(attr).then(
          (attribute) => !!attribute
        )
      ).catch(() => { throw new ElementNotFoundError(); });
    },
    ATTRIBUTE_EQUALS: (elem, attr, value) => {
      return elem.then(
        (el) => el.getAttribute(attr).then(
          (attribute) => attribute === value
        )
      ).catch(() => { throw new ElementNotFoundError(); });
    }
  }
};
