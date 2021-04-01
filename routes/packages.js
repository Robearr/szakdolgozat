const express = require('express');
const router = express.Router();

const Package = require('../models/Package');
const Test = require('../models/Test');

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
  });

module.exports = router;