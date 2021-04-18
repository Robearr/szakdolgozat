class CantReachUrlError extends Error {
  constructor() {
    super('A megadott url nem elérhető!');
    this.name = 'CantReachUrlError';
  }
}

module.exports = CantReachUrlError;