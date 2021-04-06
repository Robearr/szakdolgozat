const { CLOSE_BROWSER, CREATE_BROWSER } = require('./frame.js');

const TestRunner = require('./runners/Test');

module.exports = async (tests, url, hooks) => {
  const callAppropriateHooks = (type) => {
    hooks.forEach(async (hook) => {
      if (hook.type === type) {
        const callback = require(`${__dirname}/${hook.callbackPath}`);
        await callback();
      }
    });
  };

  CREATE_BROWSER();
  callAppropriateHooks('beforePackage');

  const results = await Promise.all(tests.map(
    async (test) => {
      callAppropriateHooks('beforeTest');
      const { name, timeout, customErrorMessage, isCustomErrorMessageVisible, isErrorDescriptionVisible, isStackVisible, points, callbackPath } = test;
      const callback = require(`${__dirname}/${callbackPath}`);
      const testResult = await TestRunner(name, timeout, customErrorMessage, isCustomErrorMessageVisible, isErrorDescriptionVisible, isStackVisible, points, callback, url);
      callAppropriateHooks('afterTest');
      return testResult;
    }
  ));

  callAppropriateHooks('afterPackage');
  CLOSE_BROWSER();

  return results;
};