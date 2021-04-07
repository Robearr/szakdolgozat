const dotenv = require('dotenv');
const express = require('express');
const router = express.Router();

const Package = require('../models/Package');
const Test = require('../models/Test');
const Hook = require('../models/Hook');
const runner = require('../runner');

dotenv.config();

const jwt = require('express-jwt');
const jwtMiddleware = jwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] });
const jsonwebtoken = require('jsonwebtoken');
const dayjs = require('dayjs');
const Statistic = require('../models/Statistic');

router
  .get('/', async (req, res) => {
    const packages = await Package.findAll();
    res.send(packages);
  })
  .get('/:id', async (req, res) => {
    const pckg = await Package.findOne({ where: { id: req.params.id }});
    res.send(pckg);
  })
  .get('/:id/activate', jwtMiddleware, async (req, res) => {
    if (!req.user.isTeacher) {
      res.send({
        severity: 'ERROR',
        messages: ['Csak oktató tud csomagot aktiválni!']
      });
      return;
    }

    await Package.update({ isActive: true }, { where: { id: req.params.id } });
    res.sendStatus(200);
  })
  .get('/:id/deactivate', jwtMiddleware, async (req, res) => {
    if (!req.user.isTeacher) {
      res.send({
        severity: 'ERROR',
        messages: ['Csak oktató tud csomagot deaktiválni!']
      });
      return;
    }

    await Package.update({ isActive: false }, { where: { id: req.params.id } });
    res.sendStatus(200);
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
    if (!req.user.isTeacher) {
      res.send({
        severity: 'ERROR',
        messages: ['Csak oktató tud csomagot létrehozni!']
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
    const pckg = await Package.findOne({ where: { id: req.params.id }});

    // activation check
    if (!pckg?.isActive) {
      res.send({
        severity: 'WARNING',
        messages: ['A csomag nincsen aktiválva!']
      });
      return;
    }

    // time check
    if ((pckg?.availableFrom && pckg?.availableTo) &&
      (dayjs().isAfter(dayjs(pckg.availableTo)) || dayjs().isBefore(dayjs(pckg.availableFrom)))) {
      res.send({
        severity: 'WARNING',
        messages: ['A megadott idősávon kívül nem lehet futtatni a csomagot!']
      });
      return;
    }

    // auth check
    let jsonwt;
    const clientJwt = req.headers?.authorization?.split(' ')[1];
    try {
      jsonwt = jsonwebtoken.verify(clientJwt, process.env.JWT_SECRET);
    } catch(err) {
      // ne küldjük el a `jwt must be provided` hibát, hiszen nem kell auth a futtatáshoz
      if (clientJwt) {
        res.send({
          severity: 'ERROR',
          messages: [err.message]
        });
        return;
      }
    }
    if (pckg?.needsAuth && !jsonwt) {
      res.send({
        severity: 'ERROR',
        messages: ['A csomag futtatásához be kell lépni!']
      });
      return;
    }

    // ip mask check
    if (pckg?.ipMask) {
      if (!new RegExp(pckg.ipMask).test(req.ip)) {
        res.send({
          severity: 'ERROR',
          messages: ['Az IP cím nem illeszkedik az eltárolt sémára!']
        });
        return;
      }
    }

    // url mask check
    if (pckg?.urlMask) {
      if (!new RegExp(pckg.urlMask).test(req.hostname)) {
        res.send({
          severity: 'ERROR',
          messages: ['Az URL nem illeszkedik az eltárolt sémára!']
        });
        return;
      }
    }

    const packageTests = await Test.findAll({ where: { packageId: req.params.id}});
    const hooks = await Hook.findAll({ where: { packageId: req.params.id }});
    let tests = packageTests;

    if (req.body.tests) {
      tests = packageTests.filter(
        (packageTest) => req.body.tests.includes(packageTest.id)
      );
    }

    const results = await runner(tests, req.body.url, hooks);

    // statisztika beállítása
    const points = results.reduce((prev, cur) => prev += cur.points, 0);

    if (!req.body.tests) {
      if (jsonwt?.id) {
        const statistic = await Statistic.findOne({ where: { userId: jsonwt.id, packageId: req.params.id } });
        if (points > statistic.result) {
          await Statistic.update({ result: points }, { where: { userId: jsonwt.id, packageId: req.params.id } });
        }
      } else {
        await Statistic.create({
          result: points,
          packageId: req.params.id
        });
      }
    }

    res.send(results);
  })
  .put('/', jwtMiddleware, async (req, res) => {
    if (!req.user.isTeacher) {
      res.send({
        severity: 'ERROR',
        messages: ['Csak oktató tud csomagot módosítani!']
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
    if (!req.user.isTeacher) {
      res.send({
        severity: 'ERROR',
        messages: ['Csak oktató tud csomagot törölni!']
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