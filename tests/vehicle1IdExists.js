const { ASSERT, VISIT } = require('../frame.js');

module.exports = async function() {
  VISIT('localhost:5000');
  await ASSERT.EXISTS('#vehicle1');
};