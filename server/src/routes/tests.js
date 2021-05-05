const CONFIG_PATH = process.env.NODE_ENV === 'test' ? `${__dirname}/../config.test.yaml` : `${__dirname}/../config.yaml`;
const dotenv = require('dotenv');
const express = require('express');
const router = express.Router();

const { readFileSync, writeFileSync } = require('fs');
const yaml = require('js-yaml');
const config = readFileSync(CONFIG_PATH);

const packages = yaml.load(config);

const runner = require('../runner');

dotenv.config();

const jwt = require('express-jwt');
const getAuthentication = require('../utils/getAuthentication');
const createOrUpdateStatistic = require('../utils/createOrUpdateStatistic');
const jwtMiddleware = jwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] });

router
  .get('/', async (req, res) => {
    const tests = packages.map((pck) => pck.tests).flat();
    res.send(tests);
  })
  .get('/:id', async (req, res) => {
    const test = packages.map((pckg) => pckg.tests).flat()[req.params.id];
    res.send(test);
  })
  .post('/', jwtMiddleware, async (req, res) => {
    const errorMessages = [];
    if (!req.user.isTeacher) {
      errorMessages.push('Csak oktató tud tesztet létrehozni!');
    }

    if (!packages[req.body.packageId]) {
      errorMessages.push('Nem létezik ilyen csomag!');
    }

    if (!req.body.name) {
      errorMessages.push('A teszt nevének megadása kötelező!');
    }

    if (!req.body.timeout) {
      errorMessages.push('A timeout megadása kötelező!');
    }

    if (!req.body.points) {
      errorMessages.push('A pontszám megadása kötelező!');
    }

    if (!req.body.packageId && req.body.packageId !== 0) {
      errorMessages.push('A packageId megadása kötelező!');
    }

    if (!req.body.callbackPath) {
      errorMessages.push('A callbackPath megadása kötelező!');
    }

    if (isNaN(parseInt(req.body.timeout))) {
      errorMessages.push('A timeout csak szám lehet!');
    }

    if (parseInt(req.body.timeout) < 0) {
      errorMessages.push('A timeoutnak nagyobbnak kell lennie nullánál!');
    }

    if (isNaN(parseInt(req.body.points))) {
      errorMessages.push('A pontszám csak szám lehet!');
    }

    if (parseInt(req.body.points) < 0) {
      errorMessages.push('A pontszámnak nagyobbnak kell lennie nullánál!');
    }

    if (req.body.packageId >= packages.length) {
      errorMessages.push('Nem létezik a csomag!');
    }

    if (typeof req.body.callbackPath !== 'string') {
      errorMessages.push('A callbackPath csak string lehet!');
    }

    const testNames = packages.map((pckg) => pckg.tests).flat().map((test) => test?.name);

    if (testNames.includes(req.body.name)) {
      errorMessages.push('A megadott tesztnév már létezik!');
    }

    if (errorMessages.length) {
      res.send({
        severity: 'ERROR',
        messages: errorMessages
      });
      return;
    }

    packages[req.body.packageId].tests.push(req.body);
    writeFileSync(CONFIG_PATH, yaml.dump(packages), 'utf-8');
    res.send(packages);
  })
  .post('/:id/run', async (req, res) => {
    const test = packages.map((pckg) => pckg.tests).flat()[req.params.id];
    const results = await runner([test], req.body.url);

    const jsonwt = getAuthentication(req, res);

    createOrUpdateStatistic(jsonwt, results, req, { testId: req.params.id });

    res.send(results);
  })
  .put('/:id', jwtMiddleware, async (req, res) => {
    if (!req.user.isTeacher) {
      res.send({
        severity: 'ERROR',
        messages: ['Csak oktató tud tesztet módosítani!']
      });
      return;
    }

    const pckgs = [...packages];
    const test = {
      ...packages.map((pckg) => pckg.tests).flat()[req.params.id],
      ...req.body
    };

    let packageId = -1;
    let testId = req.params.id;

    for (const [i, pckg] of pckgs.entries()) {
      if (pckg.tests.length < testId) {
        testId -= pckg.tests.length;
      } else {
        packageId = i;
        break;
      }
    }

    if (packageId === -1) {
      res.send({
        severity: 'ERROR',
        messages: ['Nem létezik ilyen teszt!']
      });
      return;
    }

    pckgs[packageId].tests[req.params.id] = test;

    writeFileSync(CONFIG_PATH, yaml.dump(pckgs), 'utf-8');
    res.send(pckgs[packageId].tests[req.params.id]);
  })
  .delete('/:id', jwtMiddleware, async (req, res) => {
    if (!req.user.isTeacher) {
      res.send({
        severity: 'ERROR',
        messages: ['Csak oktató tud tesztet törölni!']
      });
      return;
    }

    const pckgs = [...packages];

    let packageId = -1;
    let testId = req.params.id;

    for (const [i, pckg] of pckgs.entries()) {
      if (pckg.tests.length < testId) {
        testId -= pckg.tests.length;
      } else {
        packageId = i;
        break;
      }
    }

    if (packageId === -1) {
      res.send({
        severity: 'ERROR',
        messages: ['Nem létezik ilyen teszt!']
      });
      return;
    }

    pckgs[packageId].tests.splice(req.params.id, 1);

    writeFileSync(CONFIG_PATH, yaml.dump(pckgs), 'utf-8');
    res.send(pckgs);
  });

module.exports = router;