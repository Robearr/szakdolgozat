export default class PageNotOpenedError extends Error {
  constructor() {
    super('Nincsen megnyitva lap! Hogy meg legyen nyitva egy url, használd a `VISIT` függvényt!');
    this.name = 'PageNotOpenedError';
  }
}