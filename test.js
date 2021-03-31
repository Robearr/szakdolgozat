const { CLOSE_BROWSER, CREATE_BROWSER } = require('./frame.js');
const Test = require('./model-functions/Test.js');
const vehicle1Check = require('./tests/vehicle1-check.js');
const vehicle1IdExists = require('./tests/vehicle1-id-exists.js');

const sum = (...vals) => vals.reduce((prev, cur) => prev + cur, 0);

(async () => {
  CREATE_BROWSER();
  const oneA = await Test('vehicle 1 id exists', 10000, 'Nem létezik a `vehicle1` id-jú elem!', true , false, false, 5, vehicle1IdExists);
  const oneB = await Test('vehicle 1 check', 10000, 'Ennek nem kéne megjelennie!', false, false, false, 5, vehicle1Check);
  CLOSE_BROWSER();
  console.log(`Elért pontszám: ${sum(oneA, oneB)}/10`);
})();