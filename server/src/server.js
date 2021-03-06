const express = require('express');
const testsRouter = require('./routes/tests');
const packagesRouter = require('./routes/packages');
const authRouter = require('./routes/auth');
const statisticsRouter = require('./routes/statistics');
const cors = require('cors');
const app = express();

const jwt = require('express-jwt');
const jwtMiddleware = jwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] });

app.use(cors());
app.use(express.json());

app.use('/tests', testsRouter);
app.use('/packages', packagesRouter);
app.use('/auth', authRouter);
app.use('/statistics', jwtMiddleware, statisticsRouter);

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.send({
      severity: 'ERROR',
      messages: ['A végrehajtáshoz belépés szükséges!']
    });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server listens on port ${process.env.PORT || 5000}`);
});

module.exports = app;