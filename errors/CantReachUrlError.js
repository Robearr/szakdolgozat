export default class CantReachUrlError extends Error {
  constructor() {
    super('Nem elérhető a megadott url!');
    this.name = 'CantReachUrlError';
  }
}