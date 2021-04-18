const { GET, INPUT, ASSERT, DISPATCH } = require('../frame');

module.exports = async function() {
  const h = GET.ONE('#h');
  const s = GET.ONE('#s');
  const l = GET.ONE('#l');

  // await INPUT.SET_VALUE('#h', 10);
  // await INPUT.SET_VALUE('#s', 30);
  // await INPUT.SET_VALUE('#l', 20);
  await INPUT.SET_VALUE(h, 10);
  await INPUT.SET_VALUE(s, 30);
  await INPUT.SET_VALUE(l, 20);

  const bgBtn = GET.ONE('#bgBtn');
  await DISPATCH(bgBtn, 'click');

  const body = GET.ONE('body');
  const backgroundColor = (await GET.ATTRIBUTE(body, 'style'))?.backgroundColor;
  console.log(backgroundColor);

  await ASSERT.EQUALS(backgroundColor, 'rgb(66, 41, 36)');
};