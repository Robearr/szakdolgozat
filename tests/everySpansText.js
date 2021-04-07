const { ASSERT, GET } = require('../frame');

module.exports = async function() {
  const spans = GET.MANY('span');
  const spanTexts = Array.from(spans).map((span) => GET.ATTRIBUTE(span, 'innerText'));
  await ASSERT.EQUALS(spanTexts, 'Én egy web span vagyok!');
};