const dotenv = require('dotenv');
const express = require('express');
const router = express.Router();

const { readFileSync, writeFileSync } = require('fs');
const yaml = require('js-yaml');
const config = readFileSync('./config.yaml');

const packages = yaml.load(config);

const Hook = require('../models/Hook');
const runner = require('../runner');

dotenv.config();
const CONFIG_PATH = '../config.yaml';

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
    writeFileSync(`${__dirname}/${CONFIG_PATH}`, yaml.dump(packages), 'utf-8');

    res.sendStatus(200);
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
    writeFileSync(`${__dirname}/${CONFIG_PATH}`, yaml.dump(packages), 'utf-8');

    res.sendStatus(200);
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
    console.log(yaml.dump(packages));

    writeFileSync(`${__dirname}/${CONFIG_PATH}`, yaml.dump(packages), 'utf-8');

    res.sendStatus(200);
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
        (packageTest) => req.body.tests.includes(packageTest.id)
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
    writeFileSync(`${__dirname}/${CONFIG_PATH}`, yaml.dump(packages), 'utf-8');
    res.sendStatus(200);
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
    writeFileSync(`${__dirname}/${CONFIG_PATH}`, yaml.dump(packages), 'utf-8');
    res.sendStatus(200);
  });

module.exports = router;