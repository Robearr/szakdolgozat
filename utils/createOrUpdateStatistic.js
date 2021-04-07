const Statistic = require('../models/Statistic');

module.exports = async function(jsonwt, results, testOrPackageId) {
  const points = results.reduce((prev, cur) => prev += cur.points, 0);

  if (jsonwt?.id) {
    const statistic = await Statistic.findOne({ where: { userId: jsonwt.id, ...testOrPackageId } });
    if (!statistic?.result) {
      await Statistic.create({
        result: points,
        userId: jsonwt.id,
        ...testOrPackageId
      });
    } else if (points > statistic?.result) {
      await Statistic.update({ result: points }, { where: { userId: jsonwt.id, ...testOrPackageId } });
    }
  } else {
    await Statistic.create({
      result: points,
      ...testOrPackageId
    });
  }
};