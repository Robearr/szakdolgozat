const { CLOSE_BROWSER, CREATE_BROWSER } = require('./frame.js');

const TestRunner = require('./runners/Test');

module.exports = async (tests, url) => {
  CREATE_BROWSER();

  await Promise.all(tests.map(
    async (test) => {
      const { name, timeout, customErrorMessage, isCustomErrorMessageVisible, isErrorDescriptionVisible, isStackVisible, points, callbackPath } = test;
      const callback = require(`${__dirname}/${callbackPath}`);
      return TestRunner(name, timeout, customErrorMessage, isCustomErrorMessageVisible, isErrorDescriptionVisible, isStackVisible, points, callback, url);
    }
  ));

  CLOSE_BROWSER();
};