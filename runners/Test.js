const chalk = require('chalk');
const { VISIT } = require('../frame');

async function Test(name, timeout, customErrorMessage, isCustomErrorMessageVisible, isErrorDescriptionVisible, isStackVisible, points, callback, url) {

  await VISIT(url);

  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      console.log(chalk.red('‼ A teszt timeoutja lejárt ‼'));
      //! TMP
      // process.exit(1);
    }, timeout);

    callback().then(
      () => {
        clearTimeout(timeoutId);
        console.log(`✔ ${chalk.green('Sikeresen lefutott a teszt!')}`);
        // TODO: valahol tárolni kellene a pontokat
        resolve(points);
      }).catch(
      (err) => {
        if (isStackVisible) {
          console.log(chalk.yellow('📢 Stack trace:'));
          console.log(err.stack);
        }

        if (isErrorDescriptionVisible) {
          console.log(chalk.red.bold(err.message));
        }

        if (err.name === 'TestFailedError') {
          if (isCustomErrorMessageVisible) {
            clearTimeout(timeoutId);
            console.log(`❌ ${chalk.red(customErrorMessage)}`);
          }
          resolve(0);
        }
      });
  });
}

module.exports = Test;