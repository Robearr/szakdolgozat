const express = require('express');
const router = express.Router();

const Test = require('../models/Test');
const runner = require('../runner');

router
  .get('/', async (req, res) => {
    const tests = await Test.findAll();
    res.send(tests);
  })
  .get('/:id', async (req, res) => {
    const test = await Test.findOne({ where: { id: req.params.id}});
    res.send(test);
  })
  .post('/', async (req, res) => {
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
  .put('/', async (req, res) => {
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
  .delete('/', async (req, res) => {
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