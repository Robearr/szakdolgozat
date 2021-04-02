const { ASSERT } = require('../frame.js');

module.exports = async function() {
  await ASSERT.EXISTS('#vehicle1');
};