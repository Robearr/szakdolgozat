const chalk = require('chalk');
const { VISIT } = require('../frame');

async function Test(name, timeout, customErrorMessage, isCustomErrorMessageVisible, isErrorDescriptionVisible, isStackVisible, points, callback, url) {

  await VISIT(url);

  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      console.log(chalk.red('‼ A teszt timeoutja lejárt ‼'));
      resolve({
        severity: 'WARNING',
        messages: ['A teszt timeoutja lejárt!']
      });
      return;
    }, timeout);

    callback().then(
      () => {
        clearTimeout(timeoutId);
        console.log(`✔ ${chalk.green('Sikeresen lefutott a teszt!')}`);
        resolve({ points });
      }).catch(
      (err) => {
        clearTimeout(timeoutId);
        const result = {};
        if (isStackVisible) {
          console.log(chalk.yellow('📢 Stack trace:'));
          console.log(err.stack);
          result.stack = err.stack;
        }

        if (isErrorDescriptionVisible) {
          console.log(chalk.red.bold(err.message));
          result.errorDescription = err.message;
        }

        if (err.name === 'TestFailedError') {
          if (isCustomErrorMessageVisible) {
            console.log(`❌ ${chalk.red(customErrorMessage)}`);
            result.customErrorMessage = customErrorMessage;
          }
        }
        resolve({
          ...result,
          points: 0
        });
      });
  });
}

module.exports = Test;