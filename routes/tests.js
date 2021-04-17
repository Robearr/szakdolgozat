const dotenv = require('dotenv');
const express = require('express');
const router = express.Router();

const { readFileSync, writeFileSync } = require('fs');
const yaml = require('js-yaml');
const config = readFileSync('./config.yaml');

const packages = yaml.load(config);

const runner = require('../runner');

dotenv.config();
const CONFIG_PATH = '../config.yaml';

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

    if (errorMessages.length) {
      res.send({
        severity: 'ERROR',
        messages: errorMessages
      });
      return;
    }

    packages[req.body.packageId] = req.body;
    writeFileSync(`${__dirname}/${CONFIG_PATH}`, yaml.dump(packages), 'utf-8');
    res.sendStatus(200);
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
    if (!req.body.name) {
      res.send({
        severity: 'ERROR',
        messages: ['A teszt nevének megadása kötelező!']
      });
      return;
    }

    const pckgs = [...packages];
    const test = {
      ...packages.map((pckg) => pckg.tests).flat()[req.params.id],
      ...req.body
    };

    const packageId = packages.findIndex(
      (pckg) => pckg.tests.some((tst) => tst.name === test.name)
    );

    if (packageId === -1) {
      res.send({
        severity: 'ERROR',
        messages: ['Nincsen ilyen nevű teszt elmentve!']
      });
      return;
    }

    pckgs[packageId].tests[req.params.id] = test;

    writeFileSync(`${__dirname}/${CONFIG_PATH}`, yaml.dump(pckgs), 'utf-8');
    res.sendStatus(200);
  })
  .delete('/:id', jwtMiddleware, async (req, res) => {
    if (!req.user.isTeacher) {
      res.send({
        severity: 'ERROR',
        messages: ['Csak oktató tud tesztet törölni!']
      });
      return;
    }

    if (!req.body.name) {
      res.send({
        severity: 'ERROR',
        messages: ['A teszt nevének megadása kötelező!']
      });
      return;
    }

    const pckgs = [...packages];

    const testName = pckgs.map(
      (pckg) => pckg.tests
    ).flat()[req.params.id].name;

    const packageId = packages.findIndex(
      (pckg) => pckg.tests.some((test) => test.name === testName)
    );

    pckgs[packageId].tests.splice(req.params.id, 1);

    writeFileSync(`${__dirname}/${CONFIG_PATH}`, yaml.dump(pckgs), 'utf-8');
    res.sendStatus(200);
  });

module.exports = router;