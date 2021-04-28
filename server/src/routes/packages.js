const CONFIG_PATH = process.env.NODE_ENV === 'test' ? `${__dirname}/../config.test.yaml` : `${__dirname}/../config.yaml`;
const dotenv = require('dotenv');
const express = require('express');
const router = express.Router();

const { readFileSync, writeFileSync } = require('fs');
const yaml = require('js-yaml');
const config = readFileSync(CONFIG_PATH);

const packages = yaml.load(config);

const Hook = require('../models/Hook');
const runner = require('../runner');

dotenv.config();

const jwt = require('express-jwt');
const jwtMiddleware = jwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] });
const dayjs = require('dayjs');
const getAuthentication = require('../utils/getAuthentication');
const createOrUpdateStatistic = require('../utils/createOrUpdateStatistic');

router
  .get('/', async (req, res) => {
    res.send(packages);
  })
  .get('/:id', async (req, res) => {
    res.send(packages[req.params.id]);
  })
  .get('/:id/activate', jwtMiddleware, async (req, res) => {
    if (!req.user.isTeacher) {
      res.send({
        severity: 'ERROR',
        messages: ['Csak oktató tud csomagot aktiválni!']
      });
      return;
    }

    packages[req.params.id].isActive = true;
    writeFileSync(CONFIG_PATH, yaml.dump(packages), 'utf-8');

    res.send(packages[req.params.id]);
  })
  .get('/:id/deactivate', jwtMiddleware, async (req, res) => {
    if (!req.user.isTeacher) {
      res.send({
        severity: 'ERROR',
        messages: ['Csak oktató tud csomagot deaktiválni!']
      });
      return;
    }
    packages[req.params.id].isActive = false;
    writeFileSync(CONFIG_PATH, yaml.dump(packages), 'utf-8');

    res.send(packages[req.params.id]);
  })
  .get('/:id/tests', async (req, res) => {
    res.send(packages[req.params.id].tests);
  })
  .get('/:id/tests/:testId', async (req, res) => {
    res.send(packages[req.params.id].tests[req.params.testId]);
  })
  .post('/', jwtMiddleware, async (req, res) => {
    const errorMessages = [];

    if (dayjs(req.body.availableFrom).isAfter(req.body.availableTo)) {
      errorMessages.push('Az availableFrom csak az availableTo előtt lehet!');
    }

    if (!req.user.isTeacher) {
      errorMessages.push('Csak oktató tud csomagot létrehozni!');
    }

    if (!req.body.name) {
      errorMessages.push('A tesztcsomag nevének megadása kötelező!');
    }

    if (!req.body.timeout) {
      errorMessages.push('A timeout megadása kötelező!');
    }

    if (req.body.isActive && !['0', '1', 'true', 'false'].includes(`${req.body.isActive}`)) {
      errorMessages.push('Az isActive csak a következő értékeket veheti fel: 0, 1, true, false');
    }

    if (req.body.needsAuth && !['0', '1', 'true', 'false'].includes(`${req.body.needsAuth}`)) {
      errorMessages.push('A needsAuth csak a következő értékeket veheti fel: 0, 1, true, false');
    }

    if (isNaN(parseInt(req.body.timeout))) {
      errorMessages.push('A timeout csak szám lehet!');
    }

    if (parseInt(req.body.timeout) < 0) {
      errorMessages.push('A timeoutnak nagyobbnak kell lennie nullánál!');
    }

    if (packages.map((pckg) => pckg.name).includes(req.body.name)) {
      errorMessages.push('A megadott csomagnév már létezik!');
    }

    if (errorMessages.length) {
      res.send({
        severity: 'ERROR',
        messages: errorMessages
      });
      return;
    }

    packages.push({
      ...req.body,
      tests: []
    });

    writeFileSync(CONFIG_PATH, yaml.dump(packages), 'utf-8');

    res.send(packages);
  })
  .post('/:id/run', async (req, res) => {
    const pckg = packages[req.params.id];
    const errorMessages = [];

    // activation check
    if (!pckg?.isActive) {
      errorMessages.push('A csomag nincsen aktiválva!');
    }

    // time check
    if ((pckg?.availableFrom && pckg?.availableTo) &&
      (dayjs().isAfter(dayjs(pckg.availableTo)) || dayjs().isBefore(dayjs(pckg.availableFrom)))) {
      errorMessages.push('A megadott idősávon kívül nem lehet futtatni a csomagot!');
    }

    // auth check
    const jsonwt = getAuthentication(req, res);

    if (pckg?.needsAuth && !jsonwt) {
      errorMessages.push('A csomag futtatásához be kell lépni!');
    }

    // ip mask check
    if (pckg?.ipMask) {
      if (!new RegExp(pckg.ipMask).test(req.ip)) {
        errorMessages.push('Az IP cím nem illeszkedik az eltárolt sémára!');
      }
    }

    // url mask check
    if (pckg?.urlMask) {
      if (!new RegExp(pckg.urlMask).test(req.hostname)) {
        errorMessages.push('Az URL nem illeszkedik az eltárolt sémára!');
      }
    }

    if (errorMessages.length) {
      res.send({
        severity: 'ERROR',
        messages: errorMessages
      });
      return;
    }

    const packageTests = pckg.tests;
    const hooks = await Hook.findAll({ where: { packageId: req.params.id }});
    let tests = packageTests;

    if (req.body.tests) {
      tests = packageTests.filter(
        (packageTest, i) => req.body.tests.includes(i)
      );
    }

    const results = await runner(tests, req.body.url, hooks);

    // statisztika beállítása

    if (!req.body.tests) {
      createOrUpdateStatistic(jsonwt, results, { packageId: req.params.id });
    } else {
      req.body.tests.forEach(
        (test, i) => {
          createOrUpdateStatistic(jsonwt, [results[i]], { testId: test });
        }
      );
    }

    res.send(results);
  })
  .put('/:id', jwtMiddleware, async (req, res) => {
    if (!req.user.isTeacher) {
      res.send({
        severity: 'ERROR',
        messages: ['Csak oktató tud csomagot módosítani!']
      });
      return;
    }

    packages[req.params.id] = {
      ...packages[req.params.id],
      ...req.body
    };
    writeFileSync(CONFIG_PATH, yaml.dump(packages), 'utf-8');
    res.send(packages[req.params.id]);
  })
  .delete('/:id', jwtMiddleware, async (req, res) => {
    if (!req.user.isTeacher) {
      res.send({
        severity: 'ERROR',
        messages: ['Csak oktató tud csomagot törölni!']
      });
      return;
    }

    packages.splice(req.params.id, 1);
    writeFileSync(CONFIG_PATH, yaml.dump(packages), 'utf-8');
    res.send(packages);
  });

module.exports = router;