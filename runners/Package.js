const chalk = require('chalk');

function Package(name, description, isActive, activity, needsAuth, ipMask, urlMask, timeout, tests, hooks) {

  console.log(chalk.magentaBright(`=== Csomag: ${name} ===`));

  const timeoutId = setTimeout(() => {
    console.log(chalk.red('‼ A tesztcsomag timeoutja lejárt ‼'));
    //! TMP
    process.exit(1);
  }, timeout);

  Promise.all(tests.forEach(
    (test) => test()
  )).then(
    () => console.log(`A ${name} tesztcsomag lefutott!`)
  );

}

module.exports = Package;