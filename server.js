/* eslint-env node */

const express = require('express');
const testsRouter = require('./routes/tests');
const packagesRouter = require('./routes/packages');
const authRouter = require('./routes/auth');
const session = require('express-session');

const app = express();

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }
}));

app.use('/tests', testsRouter);
app.use('/packages', packagesRouter);
app.use('/auth', authRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listens on port ${process.env.PORT || 3000}`);
});