const express = require('express');
const router = express.Router();

const Test = require('../models/Test');
const runner = require('../runner');

const jwtMiddleware = require('express-jwt');

router
  .get('/', async (req, res) => {
    const tests = await Test.findAll();
    res.send(tests);
  })
  .get('/:id', async (req, res) => {
    const test = await Test.findOne({ where: { id: req.params.id}});
    res.send(test);
  })
  .post('/', jwtMiddleware({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }), async (req, res) => {
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
  .put('/', jwtMiddleware({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }), async (req, res) => {
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
  .delete('/', jwtMiddleware({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }), async (req, res) => {
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