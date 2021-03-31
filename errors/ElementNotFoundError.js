class ElementNotFoundError extends Error {
  constructor() {
    super('Nem létezik ezzel a selectorral elem!');
    this.name = 'ElementNotFoundError';
  }
}
module.exports = ElementNotFoundError;