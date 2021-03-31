const { ASSERT, DISPATCH, GET, INPUT, VISIT } = require('../frame.js');

module.exports = async function() {
  VISIT('localhost:5000');

  const vehicle1 = GET.ONE('#vehicle1');
  await INPUT.CHECK(vehicle1);
  await INPUT.CHECK(vehicle1);
  await DISPATCH(vehicle1, 'click');
  await ASSERT.ATTRIBUTE_EQUALS(vehicle1, 'name', 'vehicle1');
};