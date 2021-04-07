const express = require('express');
const router = express.Router();

const Statistic = require('../models/Statistic');

router
  .get('/', async (req, res) => {
    if (!req.user.isTeacher) {
      res.send({
        severity: 'ERROR',
        messages: ['A statisztikák csak oktatók számára érhetőek el!']
      });
      return;
    }

    const statistics = await Statistic.findAll();
    res.send(statistics);
  })
  .get('/packages/:packageId', async (req, res) => {
    if (!req.user.isTeacher) {
      res.send({
        severity: 'ERROR',
        messages: ['A statisztikák csak oktatók számára érhetőek el!']
      });
      return;
    }

    const statistics = await Statistic.findAll({ where: { packageId: req.params.packageId }});
    res.send(statistics);
  })
  .get('/users/:userId', async (req, res) => {
    if (!req.user.isTeacher) {
      res.send({
        severity: 'ERROR',
        messages: ['A statisztikák csak oktatók számára érhetőek el!']
      });
      return;
    }

    const statistics = await Statistic.findAll({ where: { userId: req.params.userId }});
    res.send(statistics);
  });

module.exports = router;