const express = require('express');
const { Op } = require('sequelize');
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

    const statistics = {
      loggedIn: {},
      notLoggedIn: {}
    };

    statistics.loggedIn = await Statistic.findAll({ where: { [Op.not]: [ { userId: null } ] } });
    statistics.notLoggedIn = await Statistic.findAll({ where: { userId: null } });

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