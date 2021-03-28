import { ASSERT, CREATE_BROWSER, CLOSE_BROWSER, DISPATCH, GET, INPUT, VISIT, WAIT } from './frame.js';

CREATE_BROWSER();
VISIT('localhost:5000');

(async () => {
  const button = GET.ONE('#theButton');
  console.log(await GET.ATTRIBUTE(button, 'innerText'));

  const input = GET.ONE('#textInput');
  await INPUT.WRITE(input, 'korte');

  const select = GET.ONE('#selectInput');
  await INPUT.SELECT(select, 'korte');

  const radios = GET.MANY('[name="radioInput"]');
  await INPUT.CHECK(radios, 'banan');
  await WAIT(3000);
  await INPUT.CHECK(radios, 'alma');

  const vehicle1 = GET.ONE('#vehicle1');
  const vehicle2 = GET.ONE('#vehicle2');

  await INPUT.CHECK(vehicle1);
  await WAIT(1000);
  await INPUT.CHECK(vehicle2);
  await WAIT(1000);
  await INPUT.CHECK(vehicle1);


  await WAIT(1000);
  await DISPATCH(vehicle1, 'click');

  await ASSERT.ATTRIBUTE_EQUALS(vehicle1, 'name', 'vehicle1');

  console.log(await ASSERT.EXISTS('#vehicle1'));

  await CLOSE_BROWSER();
})();
