const { DISPATCH, GET, WATCH_CONSOLE, END_WATCH_CONSOLE } = require('../frame.js');

module.exports = async function() {
  const button = GET.ONE('#theButton');
  const buttonText = await GET.ATTRIBUTE(button, 'innerText');

  WATCH_CONSOLE([buttonText]);

  await DISPATCH(button, 'click');

  END_WATCH_CONSOLE();
};