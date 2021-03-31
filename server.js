/* eslint-env node */

const express = require('express');

const app = express();

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listens on port ${process.env.PORT || 3000}`);
});