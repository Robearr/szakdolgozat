const dotenv = require('dotenv');
const express = require('express');
const router = express.Router();

const Test = require('../models/Test');
const runner = require('../runner');

dotenv.config();

const jwt = require('express-jwt');
const getAuthentication = require('../utils/getAuthentication');
const createOrUpdateStatistic = require('../utils/createOrUpdateStatistic');
const Package = require('../models/Package');
const jwtMiddleware = jwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] });

router
  .get('/', async (req, res) => {
    const tests = await Test.findAll();
    res.send(tests);
  })
  .get('/:id', async (req, res) => {
    const test = await Test.findOne({ where: { id: req.params.id}});
    res.send(test);
  })
  .post('/', jwtMiddleware, async (req, res) => {
    const errorMessages = [];
    if (!req.user.isTeacher) {
      errorMessages.push('Csak oktató tud tesztet létrehozni!');
    }

    const packages = await Package.findAll();
    const packageIds = packages.map((pckg) => pckg.id);

    if (!packageIds.includes(req.body.packageId)) {
      errorMessages.push('Nem létezik ilyen csomag!');
    }

    if (errorMessages.length) {
      res.send({
        severity: 'ERROR',
        messages: errorMessages
      });
      return;
    }

    try {
      await Test.create(req.body);
    } catch(err) {
      res.send({
        severity: 'ERROR',
        messages: err.errors
      });
      return;
    }
    res.sendStatus(200);
  })
  .post('/:id/run', async (req, res) => {
    const test = await Test.findOne({ where: { id: req.params.id }});
    const results = await runner([test], req.body.url);

    const jsonwt = getAuthentication(req, res);

    createOrUpdateStatistic(jsonwt, results, req, { testId: req.params.id });

    res.send(results);
  })
  .put('/', jwtMiddleware, async (req, res) => {
    if (!req.user.isTeacher) {
      res.send({
        severity: 'ERROR',
        messages: ['Csak oktató tud tesztet módosítani!']
      });
      return;
    }

    try {
      await Test.update(req.body, { where: { id: req.body.id } });
    } catch(err) {
      res.send({
        severity: 'ERROR',
        messages: err.errors
      });
      return;
    }
    res.sendStatus(200);
  })
  .delete('/', jwtMiddleware, async (req, res) => {
    if (!req.user.isTeacher) {
      res.send({
        severity: 'ERROR',
        messages: ['Csak oktató tud tesztet törölni!']
      });
      return;
    }

    try {
      await Test.destroy({ where: { id: req.body.id}});
    } catch(err) {
      res.send({
        severity: 'ERROR',
        messages: err.errors
      });
      return;
    }
    res.sendStatus(200);
  });

module.exports = router;