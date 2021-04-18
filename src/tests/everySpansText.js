const { ASSERT, GET } = require('../frame');

module.exports = async function() {
  const spans = await GET.MANY('span');

  const spanTexts = await Promise.all(spans.map(
    async (span) => await GET.ATTRIBUTE(span, 'innerText')
  ));

  await ASSERT.EQUALS(spanTexts, 'Én egy web span vagyok!');
};