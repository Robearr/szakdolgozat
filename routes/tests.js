const express = require('express');
const router = express.Router();

const Test = require('../models/Test');

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
    const callbackPath = test.callbackPath;
    const callback = require(`${__dirname}/../${callbackPath}`);
    // TODO: a callback meghívására fusson le a teszt
    res.send('ok');
  });

module.exports = router;