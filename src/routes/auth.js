const { createHash } = require('crypto');
const jwt = require('jsonwebtoken');

const express = require('express');
const router = express.Router();

const User = require('../models/User');

router
  .post('/login', async (req, res) => {
    const user = await User.findOne({ where: { name: req.body.name } });
    if (!user) {
      res.send({
        severity: 'ERROR',
        messages: ['Nincs ilyen felhasználó!']
      });
      return;
    }

    const md5 = createHash('md5');
    const hashedPassword = md5.update(req.body.password).digest('hex');

    if (hashedPassword === user?.password) {
      const token = jwt.sign({ id: user.id, isTeacher: user.isTeacher }, process.env.JWT_SECRET, { expiresIn: '30m' });
      req.session.token = token;
      req.session.user = user;
      res.send({ token });
      return;
    } else {
      res.send({
        severity: 'ERROR',
        messages: ['Nem megfelelő a jelszó!']
      });
      return;
    }
  });

module.exports = router;