class BrowserNotOpenedError extends Error {
  constructor() {
    super('Nincsen megnyitva böngésző! Először meg kell hívni a `CREATE_BROWSER` függvényt!');
    this.name = 'BrowserNotOpenedError';
  }
}

module.exports = BrowserNotOpenedError;