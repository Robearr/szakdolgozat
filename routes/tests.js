const dotenv = require('dotenv');
const express = require('express');
const router = express.Router();

const Test = require('../models/Test');
const runner = require('../runner');

dotenv.config();

const jwt = require('express-jwt');
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
    if (!req.user.isAdmin) {
      res.send({
        severity: 'ERROR',
        messages: ['Csak admin tud tesztet létrehozni!']
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
    res.send(results);
  })
  .put('/', jwtMiddleware, async (req, res) => {
    if (!req.user.isAdmin) {
      res.send({
        severity: 'ERROR',
        messages: ['Csak admin tud tesztet módosítani!']
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
    if (!req.user.isAdmin) {
      res.send({
        severity: 'ERROR',
        messages: ['Csak admin tud tesztet törölni!']
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