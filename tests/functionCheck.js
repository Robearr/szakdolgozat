const { ASSERT } = require('../frame.js');

module.exports = async function() {
  await ASSERT.FUNCTION_RETURNS([1, 4, 9], 'firstTask', [1, 2, 3]);
};