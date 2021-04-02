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
  .get('/:id/run', async (req, res) => {
    const test = await Test.findOne({ where: { id: req.params.id }});
    await runner([test]);
    res.sendStatus(200);
  });

module.exports = router;