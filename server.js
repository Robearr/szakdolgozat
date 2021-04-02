/* eslint-env node */

const express = require('express');
const testsRouter = require('./routes/tests');
const packagesRouter = require('./routes/packages');

const app = express();

app.use(express.json());

app.use('/tests', testsRouter);
app.use('/packages', packagesRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listens on port ${process.env.PORT || 3000}`);
});