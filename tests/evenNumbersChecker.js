const { ASSERT } = require('../frame.js');

module.exports = async function() {
  await ASSERT.FUNCTION_RETURNS(true, 'secondTask', [2, 4, 6]);
  await ASSERT.FUNCTION_RETURNS(false, 'secondTask', [1, 4, 6]);
};