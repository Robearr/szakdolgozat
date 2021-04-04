const { createHash } = require('crypto');
const jwt = require('jsonwebtoken');

const md5 = createHash('md5');
const express = require('express');
const router = express.Router();

const User = require('../models/User');

router
  .post('/login', async (req, res) => {
    const user = await User.findOne({ where: { name: req.body.name } });
    // TODO: nem jó felhasználónév hiba
    // TODO: nem jó jelszó hiba

    const hashedPassword = md5.update(req.body.password).digest('hex');

    if (hashedPassword === user.password) {
      const token = jwt.sign({ name: user.name }, process.env.JWT_SECRET, { expiresIn: '30m' });
      req.session.token = token;
      req.session.user = user;
      res.send(token);
      return;
    }
  });

module.exports = router;