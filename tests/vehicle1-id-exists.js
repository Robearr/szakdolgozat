import { ASSERT, VISIT } from '../frame.js';

export default async function() {
  VISIT('localhost:5000');
  await ASSERT.EXISTS('#vehicle1');
}