const jsonwebtoken = require('jsonwebtoken');

module.exports = function (req, res) {
  let jsonwt;
  const clientJwt = req.headers?.authorization?.split(' ')[1];
  try {
    jsonwt = jsonwebtoken.verify(clientJwt, process.env.JWT_SECRET);
  } catch (err) {
    // ne küldjük el a `jwt must be provided` hibát, hiszen nem kell auth a futtatáshoz
    if (clientJwt) {
      // TODO lejárt tokent jelezni kellene?
      // res.send({
      //   severity: 'ERROR',
      //   messages: [err.message],
      // });
      return;
    }
  }

  return jsonwt;
};
