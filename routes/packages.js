const dotenv = require('dotenv');
const express = require('express');
const router = express.Router();

const Package = require('../models/Package');
const Test = require('../models/Test');
const runner = require('../runner');

dotenv.config();

const jwt = require('express-jwt');
const jwtMiddleware = jwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] });

router
  .get('/', async (req, res) => {
    const packages = await Package.findAll();
    res.send(packages);
  })
  .get('/:id', async (req, res) => {
    const pckg = await Package.findOne({ where: { id: req.params.id }});
    res.send(pckg);
  })
  .get('/:id/tests', async (req, res) => {
    const tests = await Test.findAll({ where: { packageId: req.params.id }});
    res.send(tests);
  })
  .get('/:id/tests/:testId', async (req, res) => {
    const test = await Test.findOne({ where: { packageId: req.params.id, id: req.params.testId }});
    res.send(test);
  })
  .post('/', jwtMiddleware, async (req, res) => {
    if (!req.user.isAdmin) {
      res.send({
        severity: 'ERROR',
        messages: ['Csak admin tud csomagot létrehozni!']
      });
      return;
    }

    try {
      await Package.create(req.body);
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
    const tests = await Test.findAll({ where: { packageId: req.params.id}});
    const results = await runner(tests, req.body.url);
    res.send(results);
  })
  .put('/', jwtMiddleware, async (req, res) => {
    if (!req.user.isAdmin) {
      res.send({
        severity: 'ERROR',
        messages: ['Csak admin tud csomagot módosítani!']
      });
      return;
    }

    try {
      await Package.update(req.body, { where: { id: req.body.id } });
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
    if (!req.user.isAdmin) {
      res.send({
        severity: 'ERROR',
        messages: ['Csak admin tud csomagot törölni!']
      });
      return;
    }

    try {
      await Package.destroy({ where: { id: req.body.id}});
    } catch(err) {
      console.log(err);
      res.send({
        severity: 'ERROR',
        messages: err.errors
      });
      return;
    }
    res.sendStatus(200);
  });

module.exports = router;