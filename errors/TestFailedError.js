export default class TestFailedError extends Error {
  constructor() {
    super('A teszt nem sikerült!');
    this.name = 'TestFailedError';
  }
}